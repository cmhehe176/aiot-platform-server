import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  Transport,
  RmqOptions,
  ClientsProviderAsyncOptions,
} from '@nestjs/microservices'
import { TObject } from './type'
import { ObjectEntity, SensorEntity, SubDevice } from 'src/database/entities'
import { Repository } from 'typeorm'
import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import { formatDate } from './dayjs'
import { Client } from 'pg'

// lấy từ .env
const BOT_TOKEN = '8170639669:AAEZzoMa_VG_MaODQVPicn6SivoAas4Kszo'
const CHAT_ID = '-1002345395149'

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

export const genereateObject = (object: ObjectEntity) => {
  const list = object.object_list as TObject['object_list']
  const event = object.event_list as TObject['event_list']

  list.forEach((i, index, array) => {
    const tmp = event.find((e) => e.object_id === i.id)

    array[index] = { ...i, ...tmp }
  })

  delete object.event_list

  return object
}

export const syncDataSubDevice = async (
  sensorEntity: Repository<SensorEntity>,
  subDevice: Repository<SubDevice>,
) => {
  const [data] = await sensorEntity.find({
    order: { id: 'DESC' },
    take: 1,
  })

  const { sensor_list } = data

  sensor_list.forEach((sensor) => {
    subDevice.update({ name: sensor.name }, { device_id: data.device_id })
  })

  return data
}

export const sendImageToTelegram = async (imageUrl, caption) => {
  console.time('📸 Thời gian gửi ảnh sang Telegram')
  try {
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
      timeout: 30000,
    })

    const contentType = response.headers['content-type']

    const ext = contentType.includes('image')
      ? contentType.split('/')[1]
      : 'jpeg'

    const filePath = `image.${ext}`
    const writer = fs.createWriteStream(filePath)

    response.data.pipe(writer)

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })

    const form = new FormData()

    form.append('chat_id', CHAT_ID)
    form.append('photo', fs.createReadStream(filePath))
    form.append('caption', caption)
    form.append('parse_mode', 'HTML')

    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      form,
      { headers: form.getHeaders(), timeout: 30000 },
    )

    console.log(
      '✅ Ảnh đã gửi thành công! :',
      telegramResponse.data.result.chat.title,
    )

    fs.unlinkSync(filePath)
    console.timeEnd('📸 Thời gian gửi ảnh sang Telegram: ')
  } catch (error) {
    await axios
      .post(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        chat_id: CHAT_ID,
        photo: imageError,
        caption: ` ❌ Error Image`,
      })
      .catch((error) => error)

    console.error('Lỗi tải hoặc gửi ảnh:', error.errors)
  } finally {
    console.log(formatDate(new Date()))
  }
}

export const sendDataSensorToTelegram = async (data) => {
  try {
    let message = `<b>🚀 Dữ liệu cảm biến:</b>\n\n`

    data.forEach((sensor) => {
      message += `🎯 <b>${sensor.name}</b>\n`
      message += `   - 📝 <b>Giá trị:</b> <code>${sensor.payload} ${sensor.unit}</code>\n\n`
      // message += `   - 📝 <i>${sensor.description}</i>\n\n`;
    })

    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    })

    console.log('🚀 Đã gửi dữ liệu sensor lên Telegram!')
  } catch (error) {
    console.error('❌ Lỗi khi gửi tin nhắn:', error)
  }
}

export const createDatabase = async (dbName) => {
  try {
    const client = new Client({
      host: process.env.HOST || 'localhost',
      port: Number(process.env.POSTGRES_DB_PORT) || 5432,
      user: process.env.POSTGRES_USER || 'admin',
      password: process.env.POSTGRES_PASSWORD || 'yourpassword',
      database: 'postgres',
    })

    await client.connect()

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`,
    )
    if (res.rowCount === 0) {
      console.log(`⏳ Creating database "${dbName}"...`)
      await client.query(`CREATE DATABASE ${dbName}`)
      console.log(`✅ Database "${dbName}" created successfully!`)
    } else {
      console.log(`✅ Database "${dbName}" already exists.`)
    }

    await client.end()
  } catch (error) {
    console.error(`❌ Error creating database "${dbName}":`, error)
  }
}
