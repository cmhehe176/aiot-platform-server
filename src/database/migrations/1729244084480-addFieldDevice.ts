import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldDevice1729244084480 implements MigrationInterface {
  name = 'AddFieldDevice1729244084480'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "name" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "name" SET NOT NULL`,
    )
  }
}
