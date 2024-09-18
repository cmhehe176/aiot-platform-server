import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1726642842514 implements MigrationInterface {
    name = 'InitDb1726642842514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "role_id" integer NOT NULL DEFAULT '2', "name" character varying NOT NULL, "email" character varying NOT NULL, "telephone" character varying NOT NULL, "thumbnailUrl" text NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_49568c2027c8bc1f33f7878e189" UNIQUE ("telephone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer NOT NULL, "name" character varying NOT NULL, "alias" character varying NOT NULL, CONSTRAINT "UQ_7165de494fc9262f6c31965cca1" UNIQUE ("alias"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2658d4029dc1bf7529ebb04c047" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_74527ac40d359c0cb803baee032" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_74527ac40d359c0cb803baee032"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2658d4029dc1bf7529ebb04c047"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
