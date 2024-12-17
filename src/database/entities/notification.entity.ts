import { Column, Entity, Index } from 'typeorm'
import { BaseMessageEntity } from './base.message.entity'

@Entity({ name: 'notification' })
@Index('IDX_noti_message_id_timestamp', ['timestamp'], {
  unique: true,
})
export class NotificationEntity extends BaseMessageEntity {
  @Column({ type: 'varchar', nullable: true })
  CAT: string

  @Column({ type: 'jsonb', nullable: true })
  payload: unknown

  @Column({ type: 'jsonb', nullable: true })
  external_messages: unknown
}
