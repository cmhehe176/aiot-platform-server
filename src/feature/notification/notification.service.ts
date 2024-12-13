import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getNotificationDto } from './notification.dtio'
import { DeviceService } from '../device/device.service'
import { IUser } from 'src/common/decorators/user.decorator'

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notiEntity: Repository<NotificationEntity>,
    private readonly deviceService: DeviceService,
  ) {}

  async getNotifitacion(payload: getNotificationDto, user: IUser) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.notiEntity
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.device', 'device')

    if (payload.project_id) {
      if ((payload.project_id as any) === '-1' || payload.project_id === -1)
        delete payload.project_id

      const listDevice = await this.deviceService.getListDevice(
        user,
        payload.project_id,
      )

      const listDeviceId = listDevice.map((d) => d.id)

      if (listDeviceId.length)
        query.andWhere('notification.device_id IN (:...device_ids)', {
          device_ids: listDeviceId,
        })
    }

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
      .orderBy('notification.timestamp', 'DESC')
      .getManyAndCount()

    return { data, total }
  }
}
