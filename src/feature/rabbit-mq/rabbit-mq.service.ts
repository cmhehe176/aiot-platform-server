import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import amqp from 'amqp-connection-manager';
import { ChannelWrapper, AmqpConnectionManager } from 'amqp-connection-manager';
@Injectable()
export class RabbitMqService {
  private readonly connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    private readonly httpService: HttpService,
  ) {}

  sendMessage() {
    const message = { text: 'This is test mail from Server' };
    this.client.emit('config', message);

    return { message: 'success' };
  }

  // async getQueues() {
  //   const url = 'https://armadillo.rmq.cloudamqp.com/api/queues/xiwrmyor/';
  //   const username = 'xiwrmyor';
  //   const password = '62e2HWf8MasbujyKE4gLeNE1bK6Yhk9O';

  //   const response = this.httpService.get(url, {
  //     auth: {
  //       username,
  //       password,
  //     },
  //   });

  //   const { data } = await lastValueFrom(response);

  //   return data;
  // }
}
