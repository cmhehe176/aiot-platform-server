import { Injectable, Logger } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class MessageService {
  private readonly bot: TelegramBot;
  private logger = new Logger(MessageService.name);

  constructor() {
    this.bot = new TelegramBot(
      '8170639669:AAFfpCdAMvHf_N_gP2K5n3hmC5_n1qzoGWA',
      { polling: true },
    );

    this.bot.on('message', this.onReceiveMessage);

    //ignore
    this.sendMessageToUser('7616244643', `Server started at ${new Date()}`);
  }

  onReceiveMessage = (msg: any) => {
    switch (msg.text) {
      case '/start':
        this.bot.sendMessage('7616244643', msg.from.id);
        this.bot.sendMessage(msg.from.id, msg.from.id);
        break;

      default:
        break;
    }
  };

  sendMessageToUser = (userId: string, message: string) => {
    return this.bot.sendMessage(userId, message);
  };
}
