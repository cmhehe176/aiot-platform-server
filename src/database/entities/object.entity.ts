import { Column, Entity, Index } from 'typeorm'
import { BaseMessageEntity } from './base.message.entity'

@Entity({ name: 'object' })
@Index('IDX_object_message_id_timestamp', ['timestamp'], {
  unique: true,
})
export class ObjectEntity extends BaseMessageEntity {
  @Column({ type: 'jsonb', nullable: false })
  specs: unknown

  @Column({ type: 'jsonb', nullable: true })
  object_list: unknown

  @Column({ type: 'jsonb', nullable: true })
  event_list: unknown
}
