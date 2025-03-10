import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { RoleEntity } from './role.entity'
import { BaseEntity } from './base.entity'
import { PermissionProjectEntity } from './permission-project.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'role_id', type: 'int', default: 2 })
  roleId: number

  @Column({ type: 'varchar', nullable: false })
  name: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar', unique: true })
  telephone: string

  @Column({ type: 'text', nullable: true })
  thumbnailUrl: string

  @Column({ type: 'varchar', nullable: false })
  password: string

  @Column({ type: 'text', name: 'telegram_id', nullable: true })
  telegramId: string

  @ManyToOne('RoleEntity')
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity

  @OneToMany(() => PermissionProjectEntity, (permission) => permission.user)
  permissionProject: PermissionProjectEntity[]
}
