import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getObjectDto } from './object.dto'
import { genereateObject } from 'src/common/util'
import { DeviceService } from '../device/device.service'
import { IUser } from 'src/common/decorators/user.decorator'
@Injectable()
export class ObjectService {
  constructor(
    @InjectRepository(ObjectEntity)
    private readonly objectEntity: Repository<ObjectEntity>,
    private readonly deviceService: DeviceService,
  ) {}

  async getObject(payload: getObjectDto, user: IUser) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.objectEntity
      .createQueryBuilder('object')
      .leftJoinAndSelect('object.device', 'device')

    if (payload.project_id) {
      if ((payload.project_id as any) === '-1' || payload.project_id === -1)
        delete payload.project_id

      const listDevice = await this.deviceService.getListDevice(
        user,
        payload.project_id,
      )

      const listDeviceId = listDevice.map((d) => d.id)

      if (listDeviceId.length)
        query.andWhere('object.device_id IN (:...device_ids)', {
          device_ids: listDeviceId,
        })
    }

    if (payload.device_id && +payload.device_id !== -1) {
      query.andWhere('object.device_id = :device_id', {
        device_id: payload.device_id,
      })
    }

    if (payload.q) {
      query
        .andWhere('CAST(object.message_id AS TEXT) LIKE :q', {
          q: `%${payload.q}%`,
        })
        .orWhere('device.name LIKE :q', {
          q: `%${payload.q}%`,
        })
    }

    if (payload.type) {
      if (payload.type === 'all') delete payload.type

      query.andWhere(
        `EXISTS (
       SELECT 1
       FROM jsonb_array_elements(object.object_list::jsonb) AS type
       WHERE type->'object'->>'type' = :type
    )`,
        { type: payload.type },
      )
    }

    if (payload.start) {
      query.andWhere('object.timestamp >= :start', { start: payload.start })
    }

    if (payload.end) {
      query.andWhere('object.timestamp <= :end', { end: payload.end })
    }

    if (payload.start && payload.end) {
      query.andWhere('object.timestamp BETWEEN :start AND :end', {
        start: payload.start,
        end: payload.end,
      })
    }

    const [data, total] = await query
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('object.timestamp', 'DESC')
      .getManyAndCount()

    return { data: data.map((d) => genereateObject(d)), total }
  }

  async getDetailObject(message_id: string) {
    const object = await this.objectEntity
      .findOne({ where: { message_id: message_id } })
      .catch(console.error)

    if (!object)
      throw new BadRequestException(
        'Object not found , please check message_id',
      )

    const result = genereateObject(object)

    return result
  }

  async replyObject(id: number, replied: number) {
    await this.objectEntity
      .update({ id }, { isReplied: replied })
      .catch(console.error)

    return true
  }

  // async deleteObject(id: number) {
  //   await this.objectEntity.delete({ id }).catch(console.error)

  //   return true
  // }
}
