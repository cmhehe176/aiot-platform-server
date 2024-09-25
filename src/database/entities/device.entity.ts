import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entities';
import { ProjectEntity } from './project.entity';

@Entity({ name: 'device' })
export class DeviceEntity extends BaseEntity {
  @Column({ type: 'int', nullable: false, name: 'project_id' })
  projectId: number;

  @Column({ type: 'jsonb' })
  data: unknown;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'project_id' })
  project?: ProjectEntity;
}
