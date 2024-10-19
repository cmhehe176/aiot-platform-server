import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entities'
import { ProjectEntity } from './project.entity'

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
  mac: string

  @Column({ type: 'varchar', nullable: false, unique: true })
  deviceId: string

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity
}
