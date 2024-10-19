import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entities'
import { UserEntity } from './user.entity'
import { TypeMessage } from 'src/feature/support/support.dto'

@Entity({ name: 'support' })
export class SupportEntity extends BaseEntity {
  @Column({ type: 'int', name: 'user_id', nullable: false })
  userId: number

  @Column({ type: 'int', name: 'admin_id', nullable: true })
  adminId: number

  @Column({ type: 'varchar', nullable: false })
  title: string

  @Column({ type: 'text', nullable: false })
  description: string

  @Column({ type: 'text', nullable: true })
  reply: string

  @Column({
    type: 'varchar',
    name: 'method_message',
    nullable: true,
  })
  methodMessage: TypeMessage

  @Column({
    type: 'boolean',
    name: 'is_replied',
    nullable: false,
    default: false,
  })
  isReplied: boolean

  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity

  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'admin_id' })
  admin?: UserEntity
}
