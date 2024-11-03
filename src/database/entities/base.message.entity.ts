import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DeviceEntity } from './device.entity'

export abstract class BaseMessageEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number

  @Column({ type: 'int', nullable: false })
  device_id: number

  @Column({ type: 'varchar', nullable: false })
  message_id: unknown

  @PrimaryColumn({ type: 'timestamp', nullable: false, unique: true })
  timestamp: Date

  @Column({ type: 'jsonb', nullable: false })
  location: unknown

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => DeviceEntity, (device) => device.id)
  @JoinColumn({ name: 'device_id' })
  device?: DeviceEntity
}
