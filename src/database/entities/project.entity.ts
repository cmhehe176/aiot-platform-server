import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entities';
import { DeviceEntity } from './device.entity';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => DeviceEntity, (device) => device.project)
  device: DeviceEntity[];
}
