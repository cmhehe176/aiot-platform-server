import 'dotenv/config'

export default {
  type: 'postgres',
  host: process.env.HOST,
  port: +process.env.POSTGRES_DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/database/entities/index.ts'],
  migrations: ['src/database/migrations/*.ts'],
  seeds: ['src/database/seeds/*.seed.ts'],
}
