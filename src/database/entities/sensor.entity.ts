import { Column, Entity, Index } from 'typeorm'
import { BaseMessageEntity } from './base.message.entity'

@Entity({ name: 'sensor' })
@Index('IDX_sensor_message_id_timestamp', ['timestamp'], {
  unique: true,
})
export class SensorEntity extends BaseMessageEntity {
  @Column({ type: 'jsonb', nullable: true })
  sensor_list: any
}
