import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SensorEntity } from 'src/database/entities'
import { Repository } from 'typeorm'
import { getSensorDto } from './sensor.dto'
import { DeviceService } from '../device/device.service'
import { IUser } from 'src/common/decorators/user.decorator'

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(SensorEntity)
    private readonly sensorEntity: Repository<SensorEntity>,
    private readonly deviceService: DeviceService,
  ) {}

  async getSensor(payload: getSensorDto, user: IUser) {
    const page = payload.page || 1
    const limit = payload.limit || 20

    const query = this.sensorEntity
      .createQueryBuilder('sensor')
      .leftJoinAndSelect('sensor.device', 'device')

    if (payload.project_id) {
      if ((payload.project_id as any) === '-1' || payload.project_id === -1)
        delete payload.project_id

      const listDevice = await this.deviceService.getListDevice(
        user,
        payload.project_id,
      )

      const listDeviceId = listDevice.map((d) => d.id)

      if (listDeviceId.length)
        query.andWhere('sensor.device_id IN (:...device_ids)', {
          device_ids: listDeviceId,
        })
    }

    if (payload.device_id) {
      if ((payload.device_id as any) === '-1' || payload.device_id === -1)
        delete payload.device_id

      query.andWhere('sensor.device_id = :device_id', {
        device_id: payload.device_id,
      })
    }

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
      .orderBy('sensor.timestamp', 'DESC')
      .getManyAndCount()

    return { data, total }
  }

  getDetailSensor(message_id: string) {
    return this.sensorEntity
      .findOne({ where: { message_id: message_id } })
      .catch(console.error)
  }
}
