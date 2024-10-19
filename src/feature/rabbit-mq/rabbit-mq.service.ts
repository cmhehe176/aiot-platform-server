import { Injectable, OnModuleInit } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import {
  QueueDetails,
  QueueInfo,
  TNotification,
  TObject,
  TSensor,
} from 'src/common/type'
import { generateRandomSixDigitNumber } from 'src/common/util'
import { InjectRepository } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'
import { Repository } from 'typeorm'

@Injectable()
export class RabbitMqService {
  private readonly baseUrl: string
  private readonly username: string
  private readonly password: string

  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = 'https://armadillo.rmq.cloudamqp.com/api/queues/xiwrmyor'
    this.username = 'xiwrmyor'
    this.password = '62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O'
  }

  sendMessage(message: any, queue: string) {
    this.amqpConnection.publish('', queue, message)

    return { message: 'success' }
  }

  createSubcribe = (queue) => {
    this.amqpConnection.createSubscriber(
      (message: any) => this.handleMessage(message, queue),
      {
        queue: queue,
        queueOptions: {
          durable: false,
          autoDelete: false,
        },
      },
      `handleSubcribeFor${queue}`,
    )

    return { message: 'success' }
  }

  async getQueues(queue = '') {
    const response = this.httpService.get(`${this.baseUrl}/${queue}`, {
      auth: {
        username: this.username,
        password: this.password,
      },
    })

    const { data } = await lastValueFrom(response)

    if (queue) {
      const queueDetails = data as QueueDetails
      return {
        queue: queueDetails.name,
        vhost: queueDetails.vhost,
        state: queueDetails.state,
        consumerList: queueDetails.consumer_details.map((i) => {
          return {
            consumerTag: i.consumer_tag,
            queue: i.queue,
          }
        }),
      }
    } else {
      const listQueue = data as QueueInfo[]

      return listQueue.map((item) => {
        return {
          consumer: item.consumers,
          name: item.name,
        }
      })
    }
  }

  cancelConsume = (consume: string) => {
    this.amqpConnection.cancelConsumer(consume)

    return { message: 'success' }
  }

  getConsume = () => {
    return this.amqpConnection
  }

  handleMessage = async (message: any, queue: string) => {
    console.log({ message, queue })
  }

  handleMessageDefault = async (message: any) => {
    // console.log(message)

  }
}
