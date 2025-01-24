import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixSubDevice1737728368031 implements MigrationInterface {
  name = 'FixSubDevice1737728368031'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sub_device" DROP COLUMN "limit"`)
    await queryRunner.query(
      `ALTER TABLE "sub_device" ADD "lower_limit" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" ADD "upper_limit" character varying`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" ADD "selected_area" jsonb`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" ADD "detection_timer" character varying`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sub_device" DROP COLUMN "selected_area"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" DROP COLUMN "detection_timer"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" DROP COLUMN "upper_limit"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" DROP COLUMN "lower_limit"`,
    )
    await queryRunner.query(
      `ALTER TABLE "sub_device" ADD "limit" character varying`,
    )
  }
}
