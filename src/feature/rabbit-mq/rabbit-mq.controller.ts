import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { RabbitMqService } from './rabbit-mq.service'
import { Public } from 'src/common/decorators/public.decorator'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

@Public()
@Controller('rabbit')
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Post()
  sendMessage(@Query() payload: { queue?: string }, @Body() data: any) {
    return this.rabbitMqService.sendMessage(data, payload.queue)
  }

  @RabbitSubscribe({
    exchange: '',
    queue: 'default',
    queueOptions: {
      durable: false,
    },
  })
  handleMessaged(message: any) {
    return this.rabbitMqService.handleMessageDefault(message)
  }

  @Post('create')
  sendMessageTest(@Body() payload: { queue: string }) {
    return this.rabbitMqService.createSubcribe(payload.queue)
  }

  @Get()
  getQueues() {
    return this.rabbitMqService.getQueues()
  }

  @Post('close')
  cancelConsume(@Body() payload: { tag: string }) {
    return this.rabbitMqService.cancelConsume(payload.tag)
  }

  // @Get('consume')
  // getConsume() {
  //   return this.rabbitMqService.getConsume()
  // }
}
