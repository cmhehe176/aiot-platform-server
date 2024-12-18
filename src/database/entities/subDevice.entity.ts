import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { DeviceEntity } from './device.entity'

@Entity({ name: 'sub_device' })
export class SubDevice extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: true })
  unit: string

  @Column({ type: 'varchar', nullable: false, default: 'sensor' })
  type: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'varchar', nullable: true })
  limit: string

  @Column({ type: 'int', nullable: true })
  device_id: number

  @Column({ type: 'jsonb', nullable: true })
  permissions: unknown

  @Column({ type: 'boolean', default: true })
  publish: boolean

  @ManyToOne(() => DeviceEntity, (device) => device.id)
  @JoinColumn({ name: 'device_id' })
  device?: DeviceEntity
}
