import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { EmailService } from '../email/email.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from 'src/database/entities'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [MessageController],
  providers: [MessageService, EmailService],
})
export class MessageModule {}
