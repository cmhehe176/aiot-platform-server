import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixUserEntity1727332389504 implements MigrationInterface {
  name = 'FixUserEntity1727332389504'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "thumbnailUrl" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "thumbnailUrl" SET NOT NULL`,
    )
  }
}
