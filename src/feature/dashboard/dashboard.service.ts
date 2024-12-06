import { BadRequestException, Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { getDashboardDto } from './dashboard.dto'
import {
  NotificationEntity,
  ObjectEntity,
  SensorEntity,
} from 'src/database/entities'

@Injectable()
export class DashboardService {
  private objectEntity: Repository<ObjectEntity>
  private sensorEntity: Repository<SensorEntity>
  private notificationEntity: Repository<NotificationEntity>

  constructor(private readonly dataSource: DataSource) {
    this.objectEntity = this.dataSource.getRepository(ObjectEntity)
    this.sensorEntity = this.dataSource.getRepository(SensorEntity)
    this.notificationEntity = this.dataSource.getRepository(NotificationEntity)
  }

  getDashboard = async (device_id: number) => {
    if (!device_id) throw new BadRequestException('device id not valid')

    const [object, sensor, noti] = await Promise.all([
      this.objectEntity.countBy({ device_id }),
      this.sensorEntity.countBy({ device_id }),
      this.notificationEntity.countBy({ device_id }),
    ])

    return {
      object,
      sensor,
      noti,
    }
  }
}
