import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
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
}
