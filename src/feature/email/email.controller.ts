import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Public()
  // @Get()
  // sendMail() {
  //   return this.emailService.sendMail();
  // }
}
