import { Injectable, OnModuleInit } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { lastValueFrom } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { QueueDetails, QueueInfo } from 'src/common/type'
import {
  generateRandomSixDigitNumber,
  genereateObject,
  imageError,
  syncDataSubDevice,
} from 'src/common/util'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeviceEntity,
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
  SubDevice,
} from 'src/database/entities'
import { DataSource, Repository } from 'typeorm'
import { MessageService } from '../message/message.service'
import { TNotification, TObject, TSensor } from 'src/common/type'
import { SocketGateway } from '../socket/socket.gateway'

@Injectable()
export class RabbitMqService implements OnModuleInit {
  private readonly baseUrl: string
  private readonly username: string
  private readonly password: string
  private consumerTimers: Map<string, NodeJS.Timeout> = new Map()
  private readonly subDevice: Repository<SubDevice>

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
    private readonly dataSoure: DataSource,
  ) {
    this.baseUrl = this.configService.get('RABBITMQ_MANAGEMENT_URL')
    this.username = this.configService.get('RABBITMQ_USER')
    this.password = this.configService.get('RABBITMQ_PASS')
    this.subDevice = this.dataSoure.getRepository(SubDevice)
  }

  onModuleInit() {
    this.createQueue('accepted_devices')
  }

  sendMessage(message: any, queue: string) {
    this.amqpConnection.publish('', queue, message).catch(console.error)

    return { message: 'success' }
  }

  handleMessage = async (message: any, queue: string) => {
    console.log('message', message)

    if (!message.payload.message_id) return new Nack(true)
    // this.messageService.sendMessageToUser('-1002345395149', message.message_id)

    // This is not the best solution. If there is some free time, the flow needs to be improved.
    const tag = ((await this.getQueues(queue)) as QueueDetails)
      .consumer_details[0].consumer_tag

    const device = await this.deviceEntity.findOne({
      where: { deviceId: queue },
      select: ['id', 'deviceId', 'name', 'isActive'],
    })

    if (!device) {
      console.error('Device dont exist')

      return new Nack(true)
    }

    try {
      switch (message.message_type) {
        case 'notification':
          this.notificationMessage(message.payload as TNotification, device)
          break
        case 'object':
          this.objectMessage(message.payload as TObject, device)
          break
        case 'sensor':
          this.sensorMessage(message.payload as TSensor, device)
          break

        default:
          return
      }
    } catch (error) {
      console.error(error)

      return new Nack(true)
    } finally {
      this.resetConsumerTimer(tag, queue)
    }
  }

  handleMessageDefault = async (message: any) => {
    console.log('messageDefault', message)

    if (!message.mac_address) return
    // This is not the best solution. If there is some free time, the flow needs to be improved.
    const uniqueId = generateRandomSixDigitNumber('ID')

    const data = {
      data: message.data,
      mac_address: message.mac_address,
      deviceId: message.mac_address + ':' + uniqueId,
      name: uniqueId,
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

        if (!device.isActive)
          this.deviceEntity.update(
            { mac_address: data.mac_address },
            { isActive: true },
          )

        if (check) return

        this.createSubcribe(device.deviceId)

        // ????????????
        return this.sendMessage(
          {
            mac_address: data.mac_address,
            device_id: device.deviceId,
            status: true,
            message: `Queue for ${data.mac_address} was recreated successfully !!`,
          },
          'accepted_devices',
        )
      }

      this.createSubcribe(data.deviceId)

      const sendData = {
        mac_address: data.mac_address,
        device_id: data.deviceId,
        heartbeat_duration: 30,
        reconnect_time_in_seconds: 10,
      }

      // change here if have change something like queue name
      this.deviceEntity.insert(data).catch(console.error)

      this.sendMessage(sendData, 'accepted_devices')
    } catch (error) {
      console.error(error)

      return
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
          exchange: '',
          routingKey: queue,
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
      // return data
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

  cancelConsume = async (consume: string) => {
    await this.amqpConnection.cancelConsumer(consume)

    if (this.consumerTimers.has(consume)) {
      clearTimeout(this.consumerTimers.get(consume))

      this.consumerTimers.delete(consume)
    }

    return { message: 'success' }
  }

  async resetConsumerTimer(tag: string, queue?: string, timeout = 300000) {
    if (this.consumerTimers.has(tag)) clearTimeout(this.consumerTimers.get(tag))

    const timer = setTimeout(async () => {
      try {
        await this.cancelConsume(tag)
        this.consumerTimers.delete(tag)
        await this.deviceEntity
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
      } catch (error) {
        console.error(error)
      }
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

  objectMessage = async (message: TObject, device: DeviceEntity) => {
    message.object_list.forEach(async (object) => {
      await this.messageService
        .sendPhoto(
          this.configService.get('TELEGRAM_ID_GROUP'),
          object.image_URL ?? imageError,
          `${message?.timestamp} - ${message?.specs?.description} - ${object?.object?.type} - ${object?.object?.type === 'human' ? object?.object?.age + '-' + object?.object?.gender : object?.object?.brand + '-' + object?.object?.category + '-' + object?.object?.color + '-' + object?.object?.licence}`,
        )
        .catch(console.error)
    })

    const object = await this.objectEntity
      .save({
        device_id: device.id,
        ...message,
      })
      .catch(console.error)

    if (object)
      this.socket.sendEmit('objectMessage', {
        ...genereateObject(object as ObjectEntity),
        device,
      })

    return
  }

  notificationMessage = async (
    message: TNotification,
    device: DeviceEntity,
  ) => {
    const notification = await this.notiEntity
      .save({
        device_id: device.id,
        ...message,
      })
      .catch(console.error)

    if (notification)
      this.socket.sendEmit('notificationMessage', {
        ...notification,
        device,
      })

    return
  }

  sensorMessage = async (message: TSensor, device: DeviceEntity) => {
    try {
      const [sensor, listSubDevice] = await Promise.all([
        this.sensorEntity.save({
          device_id: device.id,
          ...message,
        }),

        this.subDevice.find({
          where: { type: 'sensor' },
        }),
      ])

      // const listSubDeviceName = listSubDevice.map((sub) => sub.name)
      // const sensorName = sensor.sensor_list.map((sub) => sub.name)

      // await Promise.all(
      //   listSubDeviceName.map((sub) => {
      //     if (sensor.sensor_list.some((sen) => sen.name === sub)) {
      //       return this.subDevice.save({ name: sub, device_id: device.id })
      //     }

      //     return this.subDevice.softDelete({ name: sub })
      //   }),
      // )

      // await Promise.all(
      //   sensor.sensor_list.map((sen) => {
      //     if (listSubDeviceName.includes(sen.name)) return

      //     return this.subDevice.save({
      //       device_id: device.id,
      //       name: sen.name,
      //       payload: sen.payload,
      //       description: sen.description,
      //       unit: sen.unit,
      //     })
      //   }),
      // )

      syncDataSubDevice(this.sensorEntity, this.subDevice)

      if (sensor) this.socket.sendEmit('sensorMessage', { ...sensor, device })
      return
    } catch (error) {
      console.error(error)
    }
  }
}
