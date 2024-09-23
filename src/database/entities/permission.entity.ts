import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entities';
import { UserEntity } from './user.entity';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'permissions' })
export class PermissionEntity extends BaseEntity {
  @Column({ name: ' permission', type: 'jsonb' })
  permission: JSON;

  @Column({ type: 'varchar', nullable: false, name: 'project_id' })
  projectId: number;

  @Column({ type: 'varchar', nullable: false, name: 'user_id' })
  userId: number;

  @ManyToOne('ProjectEntity')
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;

  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
