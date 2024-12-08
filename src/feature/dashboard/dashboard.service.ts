import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsWhere, Repository } from 'typeorm'
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
      typeDetect: await this.getTypeDetect(allDevice, startDate, endDate),
      notificationType: await this.getNotificationType(
        allDevice,
        startDate,
        endDate,
      ),
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

  getTypeDetect = async (allDevice, startDate?, endDate?) => {
    const result = []

    const objectQuery = this.objectEntity.createQueryBuilder('object')

    if (startDate && endDate) {
      objectQuery.andWhere('object.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
    }

    for (const device of allDevice) {
      objectQuery.andWhere('object.device_id = :device_id', {
        device_id: device.id,
      })

      const [human, vehicle, all] = await Promise.all([
        objectQuery
          .andWhere(
            `EXISTS (
       SELECT 1
       FROM jsonb_array_elements(object.object_list::jsonb) AS type
       WHERE type->'object'->>'type' = :type
    )`,
            { type: 'human' },
          )
          .getCount(),

        objectQuery
          .andWhere(
            `EXISTS (
       SELECT 1
       FROM jsonb_array_elements(object.object_list::jsonb) AS type
       WHERE type->'object'->>'type' = :type
    )`,
            { type: 'vehicle' },
          )
          .getCount(),

        objectQuery
          .andWhere(
            `EXISTS (
      SELECT 1
      FROM jsonb_array_elements(object.object_list::jsonb) AS type
      WHERE type->'object'->>'type' = :type1
    ) AND EXISTS (
      SELECT 1
      FROM jsonb_array_elements(object.object_list::jsonb) AS type
      WHERE type->'object'->>'type' = :type2
    )`,
            { type1: 'human', type2: 'vehicle' },
          )
          .getCount(),
      ])

      result.push({
        id: device.id,
        projectId: device.projectId,
        name: device.name,
        human,
        vehicle,
        all,
      })
    }

    return result
  }

  getNotificationType = async (allDevice, startDate?, endDate?) => {
    const result = []

    const notificationQuery =
      this.notificationEntity.createQueryBuilder('notification')

    if (startDate && endDate) {
      notificationQuery.andWhere(
        'notification.timestamp BETWEEN :start AND :end',
        {
          start: startDate,
          end: endDate,
        },
      )
    }

    for (const device of allDevice) {
      notificationQuery.andWhere('notification.device_id = :device_id', {
        device_id: device.id,
      })

      const [object, sensor] = await Promise.all([
        notificationQuery
          .andWhere(
            `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(notification.external_messages::jsonb) AS element
            WHERE element->>'type' = :type
          )`,
            { type: 'object' },
          )
          .getCount(),

        notificationQuery
          .andWhere(
            `EXISTS (
            SELECT 1
            FROM jsonb_array_elements(notification.external_messages::jsonb) AS element
            WHERE element->>'type' = :type
          )`,
            { type: 'sensor' },
          )
          .getCount(),
      ])

      result.push({
        id: device.id,
        projectId: device.projectId,
        name: device.name,
        object,
        sensor,
      })
    }

    return result
  }
}
