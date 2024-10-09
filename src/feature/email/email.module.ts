import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'aiot.platform.hust@gmail.com',
          pass: 'hyke qdnp evdz hhbp',
        },
      },
      defaults: {
        from: '"Aiot-Platform" <aiot.platform.hust@gmail.com>',
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
