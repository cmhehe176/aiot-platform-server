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

    this.sendMessageToUser('7616244643', `Server started at ${new Date()}`);
  }

  onReceiveMessage = (msg: any) => {
    this.logger.log(msg);
    this.bot.sendMessage('7616244643', msg.from.id);
  };

  sendMessageToUser = (userId: string, message: string) => {
    this.bot.sendMessage(userId, message);
  };
}
