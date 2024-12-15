import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldReply1734264434953 implements MigrationInterface {
    name = 'AddFieldReply1734264434953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "object" RENAME COLUMN "deleted_at" TO "is_replied"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "deleted_at" TO "is_replied"`);
        await queryRunner.query(`ALTER TABLE "sensor" RENAME COLUMN "deleted_at" TO "is_replied"`);
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "object" ADD "is_replied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "is_replied" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "is_replied" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "is_replied" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "is_replied" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "is_replied"`);
        await queryRunner.query(`ALTER TABLE "object" ADD "is_replied" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sensor" RENAME COLUMN "is_replied" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "notification" RENAME COLUMN "is_replied" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "object" RENAME COLUMN "is_replied" TO "deleted_at"`);
    }

}
