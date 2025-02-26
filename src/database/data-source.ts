import 'dotenv/config'
import { DataSource } from 'typeorm'
import { createDatabase } from '../common/util'

const dbName = process.env.POSTGRES_DB || 'aiot_platform'

const initDatabase = async () => {
  await createDatabase(dbName)

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.HOST,
    port: +process.env.POSTGRES_DB_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: dbName,
    entities: ['src/database/entities/index.ts'],
    migrations: ['src/database/migrations/*.ts'],
  })

  return dataSource
}

export default initDatabase()
