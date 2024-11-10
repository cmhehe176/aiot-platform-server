import { Injectable, OnModuleInit } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { QueueDetails, QueueInfo } from 'src/common/type'
import { generateRandomSixDigitNumber, imageError } from 'src/common/util'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeviceEntity,
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
} from 'src/database/entities'
import { Repository } from 'typeorm'
import { MessageService } from '../message/message.service'
import { TNotification, TObject, TSensor } from 'src/common/type'
import { SocketGateway } from '../socket/socket.gateway'

@Injectable()
export class RabbitMqService implements OnModuleInit {
  private readonly baseUrl: string
  private readonly username: string
  private readonly password: string
  private consumerTimers: Map<string, NodeJS.Timeout> = new Map()

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
    @InjectRepository(NotificationEntity)
    private readonly notiEntity: Repository<NotificationEntity>,
    @InjectRepository(ObjectEntity)
    private readonly objectEntity: Repository<ObjectEntity>,
    @InjectRepository(SensorEntity)
    private readonly sensorEntity: Repository<SensorEntity>,
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly messageService: MessageService,
    private readonly socket: SocketGateway,
  ) {
    this.baseUrl = this.configService.get('RABBITMQ_MANAGEMENT_URL')
    this.username = this.configService.get('RABBITMQ_USER')
    this.password = this.configService.get('RABBITMQ_PASS')
  }

  onModuleInit() {
    this.createQueue('accepted_devices')
  }

  sendMessage(message: any, queue: string) {
    this.amqpConnection.publish('', queue, message).catch(console.error)

    return { message: 'success' }
  }

  handleMessage = async (message: any, queue: string) => {
    // console.log({ message, queue })
    if (!message.message_id) return
    // this.messageService.sendMessageToUser('-1002345395149', message.message_id)

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    const tag = ((await this.getQueues(queue)) as QueueDetails)
      .consumer_details[0].consumer_tag

    const type = message.message_id.slice(0, 3)

    const device = await this.deviceEntity.findOne({
      where: { deviceId: queue },
      select: ['id', 'deviceId'],
    })

    if (!device) {
      console.error('Device dont exist')

      return new Nack(true)
    }

    try {
      switch (type) {
        case 'not':
          this.notificationMessage(message as TNotification, device.id)
          break
        case 'obj':
          this.objectMessage(message as TObject, device.id)
          break
        case 'sen':
          this.sensorMessage(message as TSensor, device.id)
          break

        default:
          return new Nack(true)
      }
    } catch (error) {
      console.error(error)

      return new Nack(true)
    } finally {
      this.resetConsumerTimer(tag, queue)
    }
  }

  handleMessageDefault = async (message: any) => {
    if (!message.mac_address) return

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    const data = {
      data: message.data,
      mac_address: message.mac_address,
      deviceId: message.mac_address + ':' + generateRandomSixDigitNumber('ID'),
    }

    try {
      const device = await this.deviceEntity.findOne({
        where: { mac_address: data.mac_address },
      })

      if (device) {
        const listQueue = await this.getQueues()

        const check = (listQueue as QueueInfo[]).some(
          (item) => item.name === device.deviceId,
        )

        if (check) return
        this.createSubcribe(device.deviceId)

        if (!device.isActive)
          this.deviceEntity.update(
            { mac_address: data.mac_address },
            { isActive: true },
          )

        return
      }

      this.createSubcribe(data.deviceId)

      const sendData = {
        mac_address: data.mac_address,
        device_id: data.deviceId,
        heartbeat_duration: 5,
      }

      // change here if have change something like queue name
      this.deviceEntity.insert(data).catch(console.error)

      this.sendMessage(sendData, 'accepted_devices')
    } catch (error) {
      console.error(error)

      return new Nack(true)
    } finally {
      this.socket.sendEmit('refreshApi', true)
    }

    return
  }

  // This is not the best solution. If there is some free time, the flow needs to be improved.
  // If have Nack and message requeue , it will make more consume => waste memory => need to fix
  createSubcribe = async (queue) => {
    const listQueue = await this.getQueues().catch(console.error)
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
      .catch(console.error)

    return { message: 'success' }
  }

  getQueues = async (queue = '') => {
    const response = this.httpService.get(`${this.baseUrl}/${queue}`, {
      auth: {
        username: this.username,
        password: this.password,
      },
    })

    const { data } = await lastValueFrom(response)

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    if (queue) {
      const queueDetails = data as QueueDetails

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

  cancelConsume = (consume: string) => {
    this.amqpConnection.cancelConsumer(consume)

    if (this.consumerTimers.has(consume)) {
      clearTimeout(this.consumerTimers.get(consume))

      this.consumerTimers.delete(consume)
    }

    return { message: 'success' }
  }

  resetConsumerTimer(tag: string, queue?: string, timeout = 300000) {
    if (this.consumerTimers.has(tag)) clearTimeout(this.consumerTimers.get(tag))

    const timer = setTimeout(() => {
      this.cancelConsume(tag)
      this.consumerTimers.delete(tag)
      this.deviceEntity
        .exists({ where: { deviceId: queue, isActive: true } })
        .then((check) => {
          if (check) {
            this.deviceEntity.update({ deviceId: queue }, { isActive: false })

            this.socket.sendEmit('refreshApi', true)
          }
        })
        .catch(console.error)

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
      .catch(console.error)
  }

  deleteQueue(queueName: string) {
    return this.amqpConnection.managedChannel
      .addSetup((channel) =>
        channel.deleteQueue(queueName, { ifUnused: false, ifEmpty: false }),
      )
      .then(() => console.log(`Queue "${queueName}" đã được xóa.`))
      .catch(console.error)
  }

  objectMessage = async (message: TObject, deviceId: number) => {
    message.object_list.forEach(async (i) => {
      const photoUrl = i.Human
        ? i.Human.image_URL
        : i.Vehicle.image_URL || imageError

      const description = i.Human
        ? `${i.Human.gender} - ${i.Human.age}`
        : `${i.Vehicle.brand} - ${i.Vehicle.brand} - ${i.Vehicle.color} - ${i.Vehicle.type} - ${i.Vehicle.Licence}` ||
          'No description available'

      await this.messageService.sendPhoto(
        this.configService.get('TELEGRAM_ID_GROUP'),
        photoUrl,
        description,
      )
    })

    const object = {
      device_id: deviceId,
      ...message,
    }

    return this.objectEntity.insert(object).catch(console.error)
  }

  notificationMessage = (message: TNotification, deviceId: number) => {
    const noti = {
      device_id: deviceId,
      ...message,
    }

    return this.notiEntity.insert(noti).catch(console.error)
  }

  sensorMessage = (message: TSensor, deviceId: number) => {
    const sensor = {
      device_id: deviceId,
      ...message,
    }

    return this.sensorEntity.insert(sensor).catch(console.error)
  }
}
