import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { sendMailDto } from './email.dto';
import Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(payload?: sendMailDto) {
    const { data, ...rest } = payload;

    rest.html = Handlebars.compile(rest.html)({ ...data });

    return await this.mailService.sendMail({ ...rest });
  }
}
