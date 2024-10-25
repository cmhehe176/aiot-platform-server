import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixDeviceEntity1729234956033 implements MigrationInterface {
  name = 'FixDeviceEntity1729234956033'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "mac" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "UQ_9875427736a57d18fc692e2d5ab" UNIQUE ("mac_address")`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD "deviceId" character varying NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "UQ_6fe2df6e1c34fc6c18c786ca26e" UNIQUE ("deviceId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_61d9695373207c5e4dc3db7b398"`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "project_id" DROP NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_61d9695373207c5e4dc3db7b398" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_61d9695373207c5e4dc3db7b398"`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ALTER COLUMN "project_id" SET NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_61d9695373207c5e4dc3db7b398" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "UQ_6fe2df6e1c34fc6c18c786ca26e"`,
    )
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "deviceId"`)
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "UQ_9875427736a57d18fc692e2d5ab"`,
    )
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "mac_address"`)
  }
}
