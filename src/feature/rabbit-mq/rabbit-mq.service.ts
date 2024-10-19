import { Injectable, OnModuleInit } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { TNotification, TObject, TSensor } from 'src/common/type'
import { generateRandomSixDigitNumber } from 'src/common/util'
import { InjectRepository } from '@nestjs/typeorm'
import { DeviceEntity } from 'src/database/entities'
import { Repository } from 'typeorm'

@Injectable()
export class RabbitMqService implements OnModuleInit {
  private listQueue: { queue: string; consumerKey: string }[] = []
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly deviceEntity: Repository<DeviceEntity>,
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.createSubcribe()
  }

  sendMessage(message: any, queue = 'default') {
    this.amqpConnection.publish('', queue, message)

    return { message: 'success' }
  }

  createSubcribe = async (queue = 'default') => {
    this.amqpConnection
      .createSubscriber(
        (message: any) => this.handleMessage(message, queue),
        {
          queue: queue,
          queueOptions: {
            durable: false,
            autoDelete: queue === 'default' ? false : true,
          },
        },
        `handleSubcribeFor${queue}`,
      )
      .then((tag) => {
        if (queue === 'default') return

        this.listQueue.push({
          queue: queue,
          consumerKey: tag.consumerTag,
        })
      })

    return { message: 'success' }
  }

  async getQueues() {
    const url = 'https://armadillo.rmq.cloudamqp.com/api/queues/xiwrmyor/'
    const username = 'xiwrmyor'
    const password = '62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O'

    const response = this.httpService.get(url, {
      auth: {
        username,
        password,
      },
    })

    const { data } = await lastValueFrom(response)

    return data.map((i) => i.name)
  }

  cancelConsume = (consume: string) => {
    this.amqpConnection.cancelConsumer(consume)
    this.listQueue = this.listQueue.filter((i) => i.consumerKey !== consume)

    return { message: 'success' }
  }

  getConsume = () => {
    return this.listQueue
  }

  handleMessage = async (message: any, queue: string) => {
    // console.log({ message, queue });
    if (queue === 'default' && message.macAddress) {
      const device = await this.deviceEntity.findOne({
        where: { mac: message.macAddress },
      })

      const data = {
        name: message.name,
        mac: message.macAddress,
        deviceId: message.macAddress + ':' + generateRandomSixDigitNumber('ID'),
      }

      if (!device)
        await this.deviceEntity
          .insert(data)
          .then(() => this.createSubcribe(data.deviceId))
          .catch((e) => console.error(e))
      else if (!this.listQueue.some((item) => item.queue.includes(device.mac)))
        this.createSubcribe(device.deviceId)

      // some handle for device method

      this.sendMessage(data, device.deviceId)
    } else {
    }
  }
}
