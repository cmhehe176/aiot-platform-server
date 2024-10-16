import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldTypeMthodMessage1729049437492 implements MigrationInterface {
    name = 'AddFieldTypeMthodMessage1729049437492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" ADD "method_message" character varying NULL `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "support" DROP COLUMN "method_message"`);
    }

}
