import { Injectable } from '@nestjs/common'
import {
  DataSource,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm'
import {
  DeviceEntity,
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
} from 'src/database/entities'
import { DeviceService } from '../device/device.service'

@Injectable()
export class DashboardService {
  private objectEntity: Repository<ObjectEntity>
  private sensorEntity: Repository<SensorEntity>
  private notificationEntity: Repository<NotificationEntity>
  private deviceEntity: Repository<DeviceEntity>

  constructor(
    private readonly dataSource: DataSource,
    private readonly deviceService: DeviceService,
  ) {
    this.objectEntity = this.dataSource.getRepository(ObjectEntity)
    this.sensorEntity = this.dataSource.getRepository(SensorEntity)
    this.notificationEntity = this.dataSource.getRepository(NotificationEntity)
    this.deviceEntity = this.dataSource.getRepository(DeviceEntity)
  }

  getDashboard = async (projectId, startDate, endDate) => {
    const whereCondition: FindOptionsWhere<DeviceEntity> = projectId
      ? { projectId }
      : {}

    const [allDevice, total] = await this.deviceEntity.findAndCount({
      where: whereCondition,
      select: ['id', 'name', 'projectId', 'isActive'],
      order: {
        id: 'ASC',
      },
    })

    return {
      messageDevice: await this.getMessageDevice(allDevice, startDate, endDate),
      statusDevice: await this.getStatusDevice(allDevice, total),
    }
  }

  getStatusDevice = async (allDevice: DeviceEntity[], total) => {
    let deviceActive = 0

    allDevice.forEach((device) => {
      if (device.isActive) deviceActive++
    })

    return {
      total,
      deviceActive,
      deviceInActive: total - deviceActive,
    }
  }

  getMessageDevice = async (allDevice, startDate?, endDate?) => {
    const result = []

    const objectQuery = this.objectEntity.createQueryBuilder('object')
    const notiQuery = this.objectEntity.createQueryBuilder('noti')
    const sensorQuery = this.objectEntity.createQueryBuilder('sensor')

    if (startDate && endDate) {
      objectQuery.andWhere('object.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })

      notiQuery.andWhere('noti.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })

      sensorQuery.andWhere('sensor.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
    }

    for (const device of allDevice) {
      objectQuery.andWhere('object.device_id = :device_id', {
        device_id: device.id,
      })

      notiQuery.andWhere('noti.device_id = :device_id', {
        device_id: device.id,
      })

      sensorQuery.andWhere('sensor.device_id = :device_id', {
        device_id: device.id,
      })

      const [object, sensor, notification] = await Promise.all([
        objectQuery.getCount(),
        sensorQuery.getCount(),
        notiQuery.getCount(),
      ])

      result.push({
        id: device.id,
        projectId: device.projectId,
        name: device.name,
        object,
        sensor,
        notification,
      })
    }

    return result
  }
}
