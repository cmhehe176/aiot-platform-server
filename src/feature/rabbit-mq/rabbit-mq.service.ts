import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMqService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  sendMessage() {
    const message = { text: 'Hello from Ndmc test Post message' };
    this.client.emit('message_printed', message);

    return { message: 'success' };
  }

  async getQueues() {
    const url = 'https://armadillo.rmq.cloudamqp.com/api/queues/xiwrmyor/';
    const username = 'xiwrmyor';
    const password = '62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O';

    const response = this.httpService.get(url, {
      auth: {
        username,
        password,
      },
    });

    const { data } = await lastValueFrom(response);

    return data;
  }
}
