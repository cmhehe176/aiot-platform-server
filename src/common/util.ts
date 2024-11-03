import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  Transport,
  RmqOptions,
  ClientsProviderAsyncOptions,
} from '@nestjs/microservices'

export const configureQueue = async (
  app: INestApplication<any>,
  queue: string,
) => {
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService)

  const mainQueue: RmqOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [
        configService.get<string>('RABBITMQ_PUBLIC'),
        // `amqp://${configService.get('RABBITMQ_USER')}:${configService.get('RABBITMQ_PASS')}@${configService.get('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`,
      ],
      queue: queue,
      queueOptions: {
        durable: false,
      },
    },
  }

  return mainQueue
}

export const createRabbitMqConfig: (
  service: string,
  queue: string,
) => ClientsProviderAsyncOptions = (service, queue) => ({
  name: service,
  transport: Transport.RMQ,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    options: {
      urls: [configService.get<string>('RABBITMQ_PUBLIC')],
      queue: queue,
      queueOptions: {
        durable: false,
      },
    },
  }),
})

export const EMAIL_PATTERN = /^\w+([-+._]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

export const generateRandomSixDigitNumber = (string = 'sec') => {
  return string + Math.floor(100000 + Math.random() * 900000)
}

export const generateTypeMessage = (message_id: string) => {
  const type = message_id.slice(0, 3)

  switch (type) {
    case 'not':
      return 'notification'
    case 'sen':
      return 'sensor'
    case 'obj':
      return 'object'

    default:
      return undefined
  }
}

export const imageError =
  'https://media.istockphoto.com/id/827247322/vector/danger-sign-vector-icon-attention-caution-illustration-business-concept-simple-flat-pictogram.jpg?s=612x612&w=0&k=20&c=BvyScQEVAM94DrdKVybDKc_s0FBxgYbu-Iv6u7yddbs='
