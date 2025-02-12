import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NotificationEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getNotificationDto } from './notification.dtio'
import { DeviceService } from '../device/device.service'
import { IUser } from 'src/common/decorators/user.decorator'
import dayjs from 'dayjs'

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

    const start = payload.start
      ? dayjs(payload.start).startOf('date').format()
      : undefined

    const end = payload.end
      ? dayjs(payload.end).endOf('date').format()
      : undefined

    const query = this.notiEntity
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.device', 'device')
      .where('notification.is_replied = 0')

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

    if (payload.device_id && +payload.device_id !== -1) {
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

    if (start) {
      query.andWhere('notification.timestamp >= :start', { start })
    }

    if (end) {
      query.andWhere('notification.timestamp <= :end', { end })
    }

    if (start && end) {
      query.andWhere('notification.timestamp BETWEEN :start AND :end', {
        start,
        end,
      })
    }

    const [data, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('notification.timestamp', 'DESC')
      .getManyAndCount()

    return { data, total }
  }

  async replyNotification(id: number, replied: number) {
    await this.notiEntity
      .update({ id }, { isReplied: replied })
      .catch(console.error)

    return true
  }

  // async deleteNotification(id: number) {
  //   const notification = await this.notiEntity.findOneBy({ id })

  //   if (!notification)
  //     throw new NotFoundException('Khong tim thay notification')
  //   // tim sensor va object de xoa.. upgrade for future

  //   await this.notiEntity.delete({ id }).catch(console.error)

  //   return true
  // }
}
