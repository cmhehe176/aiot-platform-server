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
      to: ['ndmc.system176@gmail.com'],
      subject: 'Test Mail',
      data: {
        name: 'NDMC',
        email: 'ndmcprohehe@gmail.com',
      },
      html: `
      <div>SendTestMail</div>
      <div>name : {{name}}</div>
      <div>from : {{email}}</div>
      `,
    };

    return this.emailService.sendMail(data);
  }
}
