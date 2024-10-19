import { RoleEntity } from 'src/database/entities/role.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class InitRoles implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection.getRepository(RoleEntity).insert([
      { id: 0, name: 'Super Admin', alias: 'super_admin' },
      { id: 1, name: 'Admin', alias: 'admin' },
      { id: 2, name: 'User', alias: 'user' },
    ]);
  }
}
