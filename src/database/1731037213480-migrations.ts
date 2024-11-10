import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migrations1731037213480 implements MigrationInterface {
  name = 'Migrations1731037213480'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "object" DROP CONSTRAINT "IDX_object_message_id_timestamp"`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "IDX_noti_message_id_timestamp"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sensor" DROP CONSTRAINT "IDX_sensor_message_id_timestamp"`,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_object_message_id_timestamp" ON "object" ("timestamp") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_noti_message_id_timestamp" ON "notification" ("timestamp") `,
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_sensor_message_id_timestamp" ON "sensor" ("timestamp") `,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_sensor_message_id_timestamp"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_noti_message_id_timestamp"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_object_message_id_timestamp"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sensor" ADD CONSTRAINT "IDX_sensor_message_id_timestamp" UNIQUE ("timestamp")`,
    )
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "IDX_noti_message_id_timestamp" UNIQUE ("timestamp")`,
    )
    await queryRunner.query(
      `ALTER TABLE "object" ADD CONSTRAINT "IDX_object_message_id_timestamp" UNIQUE ("timestamp")`,
    )
  }
}
