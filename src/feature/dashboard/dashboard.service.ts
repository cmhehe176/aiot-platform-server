import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SensorEntity } from 'src/database/entities'
import { Repository } from 'typeorm'

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SensorEntity)
    private readonly sensorEntity: Repository<SensorEntity>,
  ) {}

  async list(query: { page?: number; limit?: number }) {
    const limit = query.limit || 20
    const page = query.page || 1

    const [items, total] = await this.sensorEntity.findAndCount({
      order: {
        id: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return { data: items.map((i) => i.id), total }
  }

  async listAll() {
    const [items, total] = await this.sensorEntity.findAndCount({
      order: {
        id: 'DESC',
      },
    })

    return { data: items.map((i) => i.id), total }
  }
}
