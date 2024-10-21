import { Body, Controller, Post } from '@nestjs/common'
import { EmailService } from './email.service'
import { Public } from 'src/common/decorators/public.decorator'
import { sendMailDto } from './email.dto'
import { SourceTestMail } from './email.source'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Public()
  @Post()
  sendMail(@Body() payload: { email: string }) {
    const data: sendMailDto = {
      to: [payload.email],
      subject: 'Test Mail',
      data: {
        name: 'Test User',
        description: 'Example data for test mail',
      },
      html: SourceTestMail,
    }
    console.log(data)
    return this.emailService.sendMail(data)
  }
}
