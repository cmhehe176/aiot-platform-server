import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldSupport1728896250782 implements MigrationInterface {
    name = 'AddFieldSupport1728896250782'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "support" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "admin_id" integer, "title" character varying NOT NULL, "description" text NOT NULL, "reply" text, "is_replied" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_96879ca22261b3846c4fbf9421b" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_257edbfe3e5c7e2a66a5af7a401" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_ec6226b3485824ea48a78e9434a" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_ec6226b3485824ea48a78e9434a"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_257edbfe3e5c7e2a66a5af7a401"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_96879ca22261b3846c4fbf9421b"`);
        await queryRunner.query(`DROP TABLE "support"`);
    }

}
