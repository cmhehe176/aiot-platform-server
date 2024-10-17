import { Body, Controller, Get, Post } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { Public } from 'src/common/decorators/public.decorator';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Public()
@Controller('rabbit')
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Post()
  sendMessage() {
    const message = { text: 'This is test messae from Server' };

    return this.rabbitMqService.sendMessage(message, 'hello');
  }

  // @RabbitSubscribe({
  //   exchange: '',
  //   queue: 'default',
  //   queueOptions: {
  //     durable: false,
  //   },
  // })
  // handleMessaged(message: any) {
  //   console.log('Received message:', message);
  // }

  @Post('create')
  sendMessageTest(@Body() payload: { queue: string }) {
    return this.rabbitMqService.createSubcribe(payload.queue);
  }

  @Get()
  getQueues() {
    return this.rabbitMqService.getQueues();
  }

  @Post('close')
  cancelConsume() {
    return this.rabbitMqService.cancelConsume('handleSubcribeForhello');
  }
}
