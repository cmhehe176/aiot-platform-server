import { Connection } from 'typeorm'
import { Factory, Seeder } from 'typeorm-seeding'
import { UserEntity } from '../entities'
import * as argon from 'argon2'

export default class InitUser implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const hashPassword = await argon.hash(process.env.SEED_PASSWORD)
    const randomPhone = () => {
      const phone =
        Math.floor(Math.random() * (999999999 - 100000000 + 1)) + 100000000
      return 0 + phone.toString()
    }

    await connection.getRepository(UserEntity).insert([
      {
        name: 'Super Admin',
        email: 'super_admin@gmail.com',
        telephone: randomPhone(),
        password: hashPassword,
        thumbnailUrl: '',
        roleId: 0,
      },
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        telephone: randomPhone(),
        password: hashPassword,
        thumbnailUrl: '',
        roleId: 1,
      },
      {
        name: 'User',
        email: 'user@gmail.com',
        telephone: randomPhone(),
        password: hashPassword,
        thumbnailUrl: '',
        roleId: 2,
      },
      {
        name: 'Cong ndm',
        email: 'ndmc.system176@gmail.com',
        telephone: '12345',
        password: hashPassword,
        thumbnailUrl: '',
        roleId: 1,
      },
    ])
  }
}
