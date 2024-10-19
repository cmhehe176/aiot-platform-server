import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveDevice1727924632194 implements MigrationInterface {
    name = 'AddIsActiveDevice1727924632194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "data" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "device" ALTER COLUMN "data" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "is_active"`);
    }

}
