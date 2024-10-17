import { Controller, Get, Post } from '@nestjs/common';
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

  @RabbitSubscribe({
    exchange: '',
    queue: 'default',
    queueOptions: {
      durable: false,
    },
  })
  handleMessaged(message: any) {
    console.log('Received message:', message);
  }

  @Post('test')
  sendMessageTest() {
    return this.rabbitMqService.createSubcribe('hello');
  }

  @Get()
  getQueues() {
    return this.rabbitMqService.getQueues();
  }
}
