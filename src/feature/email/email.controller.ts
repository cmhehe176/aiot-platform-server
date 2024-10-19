import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/common/decorators/public.decorator';
import { sendMailDto } from './email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Get()
  sendMail() {
    const data: sendMailDto = {
      to: ['nguyendaominhcong@gmail.com'],
      subject: 'Test Mail',
      data: {
        name: 'Test',
        email: 'example@gmail.com',
        description: 'example data for test mail',
      },
      html: `
      <div>SendTestMail</div>
      <div>name : {{name}}</div>
      <div>data : {{description}}</div>
      <div>from : {{email}}</div>
      `,
    };

    return this.emailService.sendMail(data);
  }
}
