import 'dotenv/config'
import { DataSource } from 'typeorm'

export default new DataSource({
  type: 'postgres',
  host: 'database',
  port: +process.env.POSTGRES_DB_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/database/entities/index.ts'],
  migrations: ['src/database/migrations/*.ts'],
})
