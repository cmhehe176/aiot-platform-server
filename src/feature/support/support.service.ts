import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportEntity } from 'src/database/entities';
import { Repository } from 'typeorm';
import { CreateSupportDto, ReplyDto } from './support.dto';
import { IUser } from 'src/common/decorators/user.decorator';
import { EmailService } from '../email/email.service';
import { sendMailDto } from '../email/email.dto';
import {
  SourceMailSupport,
  SourceMailSupportReply,
} from '../email/email.source';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportEntity)
    private readonly supportEntity: Repository<SupportEntity>,
    private readonly emailService: EmailService,
  ) {}

  create = (payload: CreateSupportDto, user: IUser) => {
    const support = { ...payload, userId: user.id };

    const data: sendMailDto = {
      to: [user.email],
      subject: 'Request Support',
      html: SourceMailSupport,
      data: {
        name: user.name,
      },
    };

    Promise.all([
      this.supportEntity.insert(support),
      this.emailService.sendMail(data),
    ]);

    return { message: 'success' };
  };

  getList = async (q?: string) => {
    const support = this.supportEntity
      .createQueryBuilder('support')
      .leftJoinAndSelect('support.user', 'user')
      .leftJoinAndSelect('support.admin', 'admin')
      .select([
        'support.id',
        'support.title',
        'support.description',
        'support.createdAt',
        'support.updatedAt',
        'support.reply',
        'support.isReplied',
        'user.id',
        'user.name',
        'user.email',
        'admin.id',
        'admin.name',
        'admin.email',
      ]);

    if (q) {
      support
        .where('support.title LIKE :q', { q: `%${q}%` })
        .orWhere('support.description LIKE :q', { q: `%${q}%` });
    }

    support.orderBy('support.createdAt', 'DESC');

    return support.getMany();
  };

  reply = async (id: number, payload: ReplyDto, user: IUser) => {
    const support = await this.supportEntity.findOne({
      where: { id: id },
      relations: ['user', 'admin'],
    });

    if (!support || support.isReplied)
      throw new BadRequestException('SUPPORT IS NOT FOUND OR REPLIED');

    const data: sendMailDto = {
      to: [support.user.email],
      subject: 'Reply Support',
      html: SourceMailSupportReply,
      data: {
        name: support.user.name,
        title: support.title,
        description: support.description,
        admin: user.name,
        email: user.email,
        reply: payload.reply,
        updatedAt: new Date(),
      },
    };

    await Promise.all([
      this.emailService.sendMail(data),
      this.supportEntity.update(
        { id },
        {
          adminId: user.id,
          reply: payload.reply,
          isReplied: true,
          methodMessage: payload.method,
        },
      ),
    ]);

    return { message: 'success' };
  };
}
