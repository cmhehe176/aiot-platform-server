import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entities';
import { DeviceEntity } from './device.entity';
import { PermissionProjectEntity } from './permission-project.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => DeviceEntity, (device) => device.project)
  device: DeviceEntity[];

  @OneToMany(() => PermissionProjectEntity, (permission) => permission.user)
  permissionProject: PermissionProjectEntity[];
}
