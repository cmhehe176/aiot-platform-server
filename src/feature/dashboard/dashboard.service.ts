import { BadRequestException, Injectable } from '@nestjs/common'
import { Between, DataSource, FindOptionsWhere, Repository } from 'typeorm'
import {
  DeviceEntity,
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
} from 'src/database/entities'
import { DeviceService } from '../device/device.service'
import { IUser } from 'src/common/decorators/user.decorator'
import dayjs from 'dayjs'

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
    const start = startDate
      ? dayjs(startDate).startOf('date').format()
      : undefined

    const end = endDate ? dayjs(endDate).endOf('date').format() : undefined

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

    if (!total) return []

    return {
      messageDevice: await this.getMessageDevice(allDevice, start, end),
      statusDevice: await this.getStatusDevice(allDevice, total),
      typeDetect: await this.getTypeDetect(allDevice, start, end),
      notificationType: await this.getNotificationType(allDevice, start, end),
      notificationStatus: await this.getNotificationStatus(
        allDevice,
        start,
        end,
      ),
      totalSensorByDate: await this.getTotalSensorByDate(allDevice, start, end),
    }
  }

  getDetailSensor = async (deviceId, startDate, endDate, user: IUser) => {
    if ((startDate && !endDate) || (!startDate && endDate)) return []

    const start = startDate
      ? dayjs(startDate).startOf('date').format()
      : undefined

    const end = endDate ? dayjs(endDate).endOf('date').format() : undefined

    //prettier-ignore
    const listSensor = await this.deviceService.getSubDevice('sensor', user, [
      'name',
      'permissions',
      'lower_limit',
      'upper_limit',
    ])

    if (!listSensor.length) return []

    const listSensorMap = new Map(
      listSensor.map((sensor) => [sensor.name, sensor]),
    )

    const query = this.sensorEntity
      .createQueryBuilder('sensor')
      .where('sensor.device_id = :device_id', { device_id: deviceId })

    if (start && end) {
      query.andWhere('sensor.timestamp BETWEEN :start AND :end', { start, end })
    }

    const detailSensor = await query.getMany()

    if (!detailSensor.length) return []

    try {
      const data: any = detailSensor.map((sensor) => {
        const { sensor_list, timestamp } = sensor as any

        return sensor_list.map((sensor) => ({
          ...sensor,
          timestamp,
        }))
      })

      const result = data.flat().reduce((acc, item) => {
        if (acc[item.name]) {
          acc[item.name].push({
            payload: { data: item.payload, timestamp: item.timestamp },
            unit: item.unit,
          })
        } else {
          acc[item.name] = [
            {
              payload: { data: item.payload, timestamp: item.timestamp },
              unit: item.unit,
            },
          ]
        }

        return acc
      }, {})

      const finalResult = Object.keys(result).map((name) => {
        const sensorInfo = listSensorMap.get(name) // Lấy thông tin `abc` từ listSensor

        return {
          name,
          payload: result[name].map((entry) => entry.payload),
          unit: result[name][0]?.unit,
          lower_limit: sensorInfo?.lower_limit,
          upper_limit: sensorInfo?.upper_limit,
        }
      })

      //prettier-ignore
      return finalResult.filter((result) => listSensorMap.has(result.name))
    } catch (error) {
      throw new BadRequestException('notFound')
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
    const notiQuery = this.notificationEntity.createQueryBuilder('noti')
    const sensorQuery = this.sensorEntity.createQueryBuilder('sensor')

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

  async getTypeDetect(allDevice, startDate?: string, endDate?: string) {
    try {
      const result = []

      for (const device of allDevice) {
        const data = await this.objectEntity.find({
          where: {
            device_id: device.id,
            timestamp:
              startDate && endDate ? Between(startDate, endDate) : undefined,
          } as any,
        })

        let humanCount = 0
        let vehicleCount = 0
        let bothCount = 0

        data.forEach((record) => {
          const objectList: any = record.object_list || []
          const hasHuman = objectList.some(
            (obj) => obj.object?.type === 'human',
          )
          const hasVehicle = objectList.some(
            (obj) => obj.object?.type === 'vehicle',
          )

          if (hasHuman && hasVehicle) {
            bothCount++
          } else if (hasHuman) {
            humanCount++
          } else if (hasVehicle) {
            vehicleCount++
          }
        })

        result.push({
          id: device.id,
          projectId: device.projectId,
          name: device.name,
          human: humanCount,
          vehicle: vehicleCount,
          all: bothCount,
        })
      }

      return result
    } catch (error) {
      console.error(error)
      throw error
    }
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

  getNotificationStatus = async (allDevice, startDate?, endDate?) => {
    const deviceIds = allDevice.map((device) => device.id)

    const objectQuery = this.objectEntity
      .createQueryBuilder('object')
      .select('object.isReplied', 'isReplied')
      .addSelect('COUNT(*)', 'count')
      .where('object.device_id IN (:...deviceIds)', { deviceIds })
      .groupBy('object.isReplied')

    const notificationQuery = this.notificationEntity
      .createQueryBuilder('notification')
      .select('notification.isReplied', 'isReplied')
      .addSelect('COUNT(*)', 'count')
      .where('notification.device_id IN (:...deviceIds)', { deviceIds })
      .groupBy('notification.isReplied')

    const sensorQuery = this.sensorEntity
      .createQueryBuilder('sensor')
      .select('sensor.isReplied', 'isReplied')
      .addSelect('COUNT(*)', 'count')
      .where('sensor.device_id IN (:...deviceIds)', { deviceIds })
      .groupBy('sensor.isReplied')

    if (startDate && endDate) {
      objectQuery.andWhere('object.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })

      notificationQuery.andWhere(
        'notification.timestamp BETWEEN :start AND :end',
        {
          start: startDate,
          end: endDate,
        },
      )

      sensorQuery.andWhere('sensor.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
    }

    const [objectCounts, notificationCounts, sensorCounts] = await Promise.all([
      objectQuery.getRawMany(),
      notificationQuery.getRawMany(),
      sensorQuery.getRawMany(),
    ])

    return {
      objects: objectCounts.map((object) => this.getStatus(object)),
      notifications: notificationCounts.map((noti) => this.getStatus(noti)),
      sensors: sensorCounts.map((sensor) => this.getStatus(sensor)),
    }
  }

  getStatus = (status: any) => {
    switch (status.isReplied) {
      case 0:
        return {
          status: 'Pending',
          count: status.count,
        }
      case 1:
        return {
          status: 'Accepted',
          count: status.count,
        }
      case 2:
        return {
          status: 'Reject',
          count: status.count,
        }

      default:
        return
    }
  }

  getTotalSensorByDate = async (
    allDevice: DeviceEntity[],
    startDate: any = new Date(),
    endDate: any = new Date(),
  ) => {
    const deviceIds = allDevice.map((device) => device.id)

    const result = await this.sensorEntity
      .createQueryBuilder('sensor')
      .select('DATE(sensor.timestamp)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('sensor.device_id IN (:...deviceIds)', { deviceIds })
      .andWhere('sensor.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      })
      .groupBy('DATE(sensor.timestamp)')
      .getRawMany()

    return result
  }
}
