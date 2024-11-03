import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from './base.entity'
import { UserEntity } from './user.entity'
import { ProjectEntity } from './project.entity'

@Entity({ name: 'permission_project' })
export class PermissionProjectEntity extends BaseEntity {
  @Column({ name: 'permission', type: 'jsonb' })
  permission: unknown

  @Column({ type: 'int', nullable: false, name: 'project_id' })
  projectId: number

  @Column({ type: 'int', nullable: false, name: 'user_id' })
  userId: number

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity
}
