import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class RabbitMqService implements OnModuleInit {
  private queues: string[] = [];

  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly httpService: HttpService,
  ) {}

  async onModuleInit() {
    await this.createSubcribe();
  }

  sendMessage(message: any, queue = 'default') {
    return this.amqpConnection.publish('', queue, message);
  }

  createSubcribe = async (queue = 'default') => {
    await this.amqpConnection.createSubscriber(
      async (message) => {
        // add handler messsage
        console.log(message);
      },
      {
        queue: queue,
        queueOptions: {
          durable: false,
        },
      },
      `handleSubcribeFor${queue}`,
    );

    return { message: 'success' };
  };

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

    return data.map((i) => i.name);
  }
}
