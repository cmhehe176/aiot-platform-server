import { MigrationInterface, QueryRunner } from "typeorm";

export class FixSensor1730013990678 implements MigrationInterface {
    name = 'FixSensor1730013990678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "data"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "specs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" ADD "specs" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "data" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "object" ADD "data" jsonb NOT NULL`);
    }

}
