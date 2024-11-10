import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getObjectDto } from './object.dto'
import { TObject } from 'src/common/type'
@Injectable()
export class ObjectService {
  constructor(
    @InjectRepository(ObjectEntity)
    private readonly objectEntity: Repository<ObjectEntity>,
  ) {}

  async getObject(payload: getObjectDto) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.objectEntity
      .createQueryBuilder('object')
      .where('object.device_id = :device_id', { device_id: payload.device_id })
      .leftJoinAndSelect('object.device', 'device')

    if (payload.q) {
      query
        .andWhere('CAST(object.message_id AS TEXT) LIKE :q', {
          q: `%${payload.q}%`,
        })
        .orWhere('device.name LIKE :q', {
          q: `%${payload.q}%`,
        })
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
      .getManyAndCount()

    // const test = data.map((item) => {
    //   if (!item.object_list || !item.event_list) return item

    //   const evenList = item.event_list as TObject['event_list']
    // })

    return { data, total }
  }

  getDetailObject(message_id: string) {
    return this.objectEntity
      .findOne({ where: { message_id: message_id } })
      .catch(console.error)
  }
}
