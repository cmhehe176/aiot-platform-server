import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportEntity } from 'src/database/entities';
import { EmailService } from '../email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupportEntity])],
  controllers: [SupportController],
  providers: [SupportService, EmailService],
})
export class SupportModule {}
