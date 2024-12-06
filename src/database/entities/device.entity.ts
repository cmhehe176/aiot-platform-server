import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from './base.entity'
import { ProjectEntity } from './project.entity'
import { ObjectEntity } from './object.entity'
import { NotificationEntity } from './notification.entity'
import { SensorEntity } from './sensor.entity'

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @Column({ type: 'int', nullable: true, name: 'project_id' })
  projectId: number

  @Column({ type: 'jsonb', nullable: true })
  data: unknown

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean

  @Column({ type: 'varchar', nullable: true })
  name: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  mac_address: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  deviceId: string

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity

  @OneToMany(() => ObjectEntity, (object) => object.device)
  object: ObjectEntity[]

  @OneToMany(() => NotificationEntity, (not) => not.device)
  notification: NotificationEntity[]

  @OneToMany(() => SensorEntity, (sensor) => sensor.device)
  sensor: SensorEntity[]
}
