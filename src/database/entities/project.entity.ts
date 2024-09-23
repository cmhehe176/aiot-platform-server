import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entities';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
