import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
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

  getDashboard = async (projectId) => {
    const allDevice = await this.deviceEntity.find({
      where: { projectId },
      select: ['id', 'name', 'projectId'],
      order: {
        id: 'ASC',
      },
    })

    await this.getMessageDevice(allDevice)

    return {
      messageDevice: await this.getMessageDevice(allDevice),
      statusDevice: await this.getStatusDevice(),
    }
  }

  getStatusDevice = async () => {
    const total = await this.deviceEntity.count()
    const deviceActive = await this.deviceEntity.countBy({ isActive: true })
    const deviceinActive = total - deviceActive

    return { total, deviceActive, deviceinActive }
  }

  getMessageDevice = async (allDevice) => {
    const result = []

    for (const device of allDevice) {
      const [object, sensor, notification] = await Promise.all([
        this.objectEntity.countBy({ device_id: device.id }),
        this.sensorEntity.countBy({ device_id: device.id }),
        this.notificationEntity.countBy({ device_id: device.id }),
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
