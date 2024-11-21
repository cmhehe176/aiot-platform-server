import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ObjectEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getObjectDto } from './object.dto'
import { genereateObject } from 'src/common/util'
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

    if (payload.type) {
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

    return { data, total }
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
}
