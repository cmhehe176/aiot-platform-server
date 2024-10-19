import { Controller, Get, Post } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { Public } from 'src/common/decorators/public.decorator';
import { EventPattern } from '@nestjs/microservices';

@Public()
@Controller('rabbit')
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Post()
  async sendMessage() {
    return this.rabbitMqService.sendMessage();
  }

  @Get()
  getQueues() {
    return this.rabbitMqService.getQueues();
  }

  // @EventPattern('object')
  // async handleQueue1(data: any) {
  //   await console.log(data);
  // }
}
