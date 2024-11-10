import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SensorEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getSensorDto } from './sensor.dto'

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(SensorEntity)
    private readonly sensorEntity: Repository<SensorEntity>,
  ) {}

  async getSensor(payload: getSensorDto) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.sensorEntity
      .createQueryBuilder('sensor')
      .where('sensor.device_id = :device_id', { device_id: payload.device_id })
      .leftJoinAndSelect('sensor.device', 'device')

    if (payload.q) {
      query
        .andWhere('CAST(sensor.message_id AS TEXT) LIKE :q', {
          q: `%${payload.q}%`,
        })
        .orWhere('device.name LIKE :q', {
          q: `%${payload.q}%`,
        })
    }

    if (payload.start) {
      query.andWhere('sensor.timestamp >= :start', { start: payload.start })
    }

    if (payload.end) {
      query.andWhere('sensor.timestamp <= :end', { end: payload.end })
    }

    if (payload.start && payload.end) {
      query.andWhere('sensor.timestamp BETWEEN :start AND :end', {
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

  getDetailSensor(message_id: string) {
    return this.sensorEntity
      .findOne({ where: { message_id: message_id } })
      .catch(console.error)
  }
}
