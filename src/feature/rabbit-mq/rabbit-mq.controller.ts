import { Body, Controller, Get,  Post, Query } from '@nestjs/common'
import { RabbitMqService } from './rabbit-mq.service'
import { Public } from 'src/common/decorators/public.decorator'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

@Public()
@Controller('rabbit')
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Post()
  sendMessage(@Query() query: { queue?: string }, @Body() data: any) {
    return this.rabbitMqService.sendMessage(data, query.queue)
  }

  @RabbitSubscribe({
    exchange: '',
    queue: 'device_registry',
    queueOptions: {
      durable: false,
    },
  })
  handleMessage(message: any) {
    return this.rabbitMqService.handleMessageDefault(message)
  }

  @Post('create')
  create(@Body() payload: { queue: string }) {
    return this.rabbitMqService.createSubcribe(payload.queue)
  }

  @Get()
  getQueues(@Query() payload: { queue: string }) {
    return this.rabbitMqService.getQueues(payload.queue)
  }

  @Post('close')
  cancelConsume(@Body() payload: { tag: string }) {
    return this.rabbitMqService.cancelConsume(payload.tag)
  }

  @Post('create-queue')
  createQueue(@Body() payload: { queue: string }) {
    return this.rabbitMqService.createQueue(payload.queue)
  }

  @Post('delete-queue')
  deleteQueue(@Body() payload: { queue: string }) {
    return this.rabbitMqService.deleteQueue(payload.queue)
  }

  // seed data
  // @RabbitSubscribe({
  //   exchange: '',
  //   queue: 'notification',
  //   queueOptions: {
  //     durable: true,
  //   },
  // })
  // notification(message: any) {
  //   let today = new Date()

  //   today.setDate(today.getDate() + this.counta)

  //   message.timestamp = today

  //   this.counta += 1

  //   return this.rabbitMqService.notificationMessage(message, 3)
  // }

  // @RabbitSubscribe({
  //   exchange: '',
  //   queue: 'object',
  //   queueOptions: {
  //     durable: true,
  //   },
  // })
  // object(message: any) {
  //   let today = new Date()

  //   today.setDate(today.getDate() + this.countb)

  //   message.timestamp = today

  //   this.countb += 1

  //   return this.rabbitMqService.objectMessage(message, 3)
  // }

  // @RabbitSubscribe({
  //   exchange: '',
  //   queue: 'sensor',
  //   queueOptions: {
  //     durable: true,
  //   },
  // })
  // handleMessage2(message: any) {
  //   let today = new Date()

  //   today.setDate(today.getDate() + this.countc)

  //   message.timestamp = today

  //   this.countc += 1
  //   return this.rabbitMqService.sensorMessage(message, 3)
  // }
}
