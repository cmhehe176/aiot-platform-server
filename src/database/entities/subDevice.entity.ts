import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { DeviceEntity } from './device.entity'

@Entity({ name: 'sub_device' })
export class SubDevice extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', nullable: true })
  type: string

  @Column({ type: 'varchar', nullable: true })
  unit: string

  @Column({ type: 'varchar', nullable: true })
  description: string

  @Column({ type: 'int', nullable: false })
  device_id: number

  @ManyToOne(() => DeviceEntity, (device) => device.id)
  @JoinColumn({ name: 'device_id' })
  device?: DeviceEntity
}
