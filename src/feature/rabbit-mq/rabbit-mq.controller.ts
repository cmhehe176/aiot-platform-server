import { Controller, Post } from '@nestjs/common';
import { RabbitMqService } from './rabbit-mq.service';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('rabbit')
export class RabbitMqController {
  constructor(private readonly rabbitMqService: RabbitMqService) {}

  @Post()
  async sendMessage() {
    return this.rabbitMqService.sendMessage();
  }

  // @Get()
  // getQueues() {
  //   return this.rabbitMqService.getQueues();
  // }

  // @MessagePattern({ message_id: 'obj-0000-00000000' })
  // async handleQueue1(data: any) {
  //   return await console.log(data);
  // }
}
