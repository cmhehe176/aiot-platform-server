import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getNotificationDto } from './notification.dtio'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notiEntity: Repository<NotificationEntity>,
  ) {}

  async getNotifitacion(payload: getNotificationDto) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.notiEntity
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.device', 'device')

    if (payload.device_id) {
      query.andWhere('notification.device_id = :device_id', {
        device_id: payload.device_id,
      })
    }

    if (payload.q) {
      query
        .andWhere('CAST(notification.message_id AS TEXT) LIKE :q', {
          q: `%${payload.q}%`,
        })
        .orWhere('device.name LIKE :q', {
          q: `%${payload.q}%`,
        })
    }

    if (payload.start) {
      query.andWhere('notification.timestamp >= :start', {
        start: payload.start,
      })
    }

    if (payload.end) {
      query.andWhere('notification.timestamp <= :end', { end: payload.end })
    }

    if (payload.start && payload.end) {
      query.andWhere('notification.timestamp BETWEEN :start AND :end', {
        start: payload.start,
        end: payload.end,
      })
    }

    const [data, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount()

    return { data, total }
  }
}
