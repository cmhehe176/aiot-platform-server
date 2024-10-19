import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldTeleramId1729148883003 implements MigrationInterface {
    name = 'AddFieldTeleramId1729148883003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "telegram_id" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "telegram_id"`);
    }

}
