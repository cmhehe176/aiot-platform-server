import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeleteObject1732191350144 implements MigrationInterface {
    name = 'AddDeleteObject1732191350144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "object" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "deleted_at"`);
    }

}
