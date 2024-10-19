import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldDevice1729244084480 implements MigrationInterface {
  name = 'AddFieldDevice1729244084480'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "consumer_tag" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "UQ_f751369bdf3365a4e800194392f" UNIQUE ("consumer_tag")`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "name" DROP NOT NULL`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "name" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "UQ_f751369bdf3365a4e800194392f"`,
    )
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "consumer_tag"`)
  }
}
