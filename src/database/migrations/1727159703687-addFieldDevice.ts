import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddFieldDevice1727159703687 implements MigrationInterface {
  name = 'AddFieldDevice1727159703687'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "project_id" integer NOT NULL, "data" jsonb NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_4ef47f22b7d7a201e20dee04575" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_f6dc0f4c7bfcb642d1ba23b5215" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "device" DROP CONSTRAINT "FK_f6dc0f4c7bfcb642d1ba23b5215"`,
    )
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_4ef47f22b7d7a201e20dee04575"`,
    )
    await queryRunner.query(`DROP TABLE "device"`)
  }
}
