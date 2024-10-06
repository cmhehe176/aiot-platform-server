import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(@Inject('RABBITMQ_SERVICE') private client: ClientProxy) {}

  sendMessage() {
    const message = { text: 'Hello from Ndmc test Post message' };
    this.client.emit('message_printed', message);

    return { message: 'success' };
  }
}
