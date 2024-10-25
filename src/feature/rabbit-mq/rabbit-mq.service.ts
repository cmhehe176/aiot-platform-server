import { Injectable, OnModuleInit } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { QueueDetails, QueueInfo } from 'src/common/type'
import { generateRandomSixDigitNumber } from 'src/common/util'
import { InjectRepository } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { MessageService } from '../message/message.service'
@Injectable()
export class RabbitMqService implements OnModuleInit {
  private readonly baseUrl: string
  private readonly username: string
  private readonly password: string
  private consumerTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,

    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
  ) {
    this.baseUrl = 'https://armadillo.rmq.cloudamqp.com/api/queues/xiwrmyor'
    this.username = 'xiwrmyor'
    this.password = '62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O'
  }

  onModuleInit() {
    this.createQueue('default')
  }

  sendMessage(message: any, queue: string) {
    this.amqpConnection.publish('', queue, message).catch((e) => e)

    return { message: 'success' }
  }
  // This is not the best solution. If there is some free time, the flow needs to be improved.
  // If have Nack and message requeue , it will make more consume => waste memory => need to fix
  createSubcribe = async (queue) => {
    const listQueue = await this.getQueues().catch((e) => e)
    const check = await (listQueue as QueueInfo[]).some((i) => i.name === queue)

    if (check) return

    this.amqpConnection
      .createSubscriber(
        (message: any) => this.handleMessage(message, queue),
        {
          queue: queue,
          queueOptions: {
            durable: false,
            autoDelete: true,
          },
        },
        `handleSubcribeFor${queue}`,
      )
      .then((tag) => this.resetConsumerTimer(tag.consumerTag, queue))
      .catch((e) => console.error(e))

    return { message: 'success' }
  }

  async getQueues(queue = '') {
    const response = this.httpService.get(`${this.baseUrl}/${queue}`, {
      auth: {
        username: this.username,
        password: this.password,
      },
    })

    const { data }: any = await lastValueFrom(response)

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    if (queue) {
      const queueDetails: QueueDetails = data as QueueDetails

      return {
        queue: queueDetails.name,
        vhost: queueDetails.vhost,
        state: queueDetails.state,
        consumer_details: queueDetails.consumer_details.map((i) => {
          return {
            consumer_tag: i.consumer_tag,
            queue: i.queue,
          }
        }),
      } as unknown as QueueDetails
    } else {
      const listQueue = data as QueueInfo[]

      return listQueue.map((item) => {
        return {
          consumers: item.consumers,
          name: item.name,
        } as unknown as QueueInfo
      })
    }
  }

  handleMessage = async (message: any, queue: string) => {
    console.log({ message, queue })
    this.messageService.sendMessageToUser('7616244643', message.message_id)

    const listQueue = await this.getQueues(queue).catch((e) => e)
    const tag = (listQueue as QueueDetails).consumer_details[0].consumer_tag

    this.resetConsumerTimer(tag, queue)
  }

  handleMessageDefault = async (message: any) => {
    // return new Nack(true)
    if (!message.message_id || !message.macAddress) return

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    const data = {
      data: {},
      mac: message.macAddress,
      deviceId: message.macAddress + ':' + generateRandomSixDigitNumber('ID'),
    }

    const device = await this.deviceEntity.findOne({
      where: { mac: data.mac },
    })

    if (device) {
      const listQueue = await this.getQueues().catch((e) => e)

      const check = (listQueue as QueueInfo[]).some(
        (item) => item.name === device.deviceId,
      )

      if (check) return

      this.createSubcribe(device.deviceId)

      return
    }

    this.createSubcribe(data.deviceId)

    this.deviceEntity
      .insert(data)
      // change here if have change something like queue
      .then(() => this.sendMessage({ queue: data.deviceId }, 'default'))
      .catch((e) => console.log(e))

    return
  }

  cancelConsume = (consume: string) => {
    this.amqpConnection.cancelConsumer(consume)

    if (this.consumerTimers.has(consume)) {
      clearTimeout(this.consumerTimers.get(consume))

      this.consumerTimers.delete(consume)
    }

    return { message: 'success' }
  }

  resetConsumerTimer(tag: string, queue = 'default', timeout = 30000) {
    if (this.consumerTimers.has(tag)) {
      clearTimeout(this.consumerTimers.get(tag))
    }

    const timer = setTimeout(() => {
      this.cancelConsume(tag)
      this.consumerTimers.delete(tag)
      console.log(
        `Consumer cho queue : ${queue} - ${tag} đã bị huỷ do không nhận được tin nhắn.`,
      )
    }, timeout)

    this.consumerTimers.set(tag, timer)
  }

  createQueue(queueName: string) {
    return this.amqpConnection.managedChannel
      .addSetup((channel) => channel.assertQueue(queueName, { durable: true }))
      .then(() => console.log(`Queue "${queueName}" đã được tạo`))
      .catch((e) => e)
  }

  deleteQueue(queueName: string) {
    return this.amqpConnection.managedChannel
      .addSetup((channel) =>
        channel.deleteQueue(queueName, { ifUnused: false, ifEmpty: false }),
      )
      .then(() => console.log(`Queue "${queueName}" đã được xóa.`))
      .catch((e) => e)
  }
}
