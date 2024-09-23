import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldPermissionAndProjects1727085849083 implements MigrationInterface {
    name = 'AddFieldPermissionAndProjects1727085849083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, " permission" jsonb NOT NULL, "project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_2e1f1bca5b63a16ecd6c1c91b70" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_fa90e828f6c00b76e28a5386295" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_2c8edd9e05f6d807b445e77de13" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_63fa749c5cfd18f01e4cf88abfb" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_498404ce35391987477a8e10c21" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_03f05d2567b1421a6f294d69f45" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_03f05d2567b1421a6f294d69f45"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_498404ce35391987477a8e10c21"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_63fa749c5cfd18f01e4cf88abfb"`);
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_2c8edd9e05f6d807b445e77de13"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_fa90e828f6c00b76e28a5386295"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_2e1f1bca5b63a16ecd6c1c91b70"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
