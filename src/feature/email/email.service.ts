import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { sendMailDto } from './email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  sendMail(payload: sendMailDto) {
    const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

    this.mailService.sendMail({
      to: 'congndm@rabiloo.com@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      text: message,
    });
  }
}
