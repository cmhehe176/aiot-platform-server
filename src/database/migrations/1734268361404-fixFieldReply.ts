import { MigrationInterface, QueryRunner } from "typeorm";

export class FixFieldReply1734268361404 implements MigrationInterface {
    name = 'FixFieldReply1734268361404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "object" ADD "is_replied" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "is_replied" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "is_replied" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "is_replied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "is_replied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "object" ADD "is_replied" boolean NOT NULL DEFAULT false`);
    }

}
