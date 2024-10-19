import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  alias: string;

  @OneToMany(() => UserEntity, (user) => user.roleId)
  user: UserEntity[];
}
