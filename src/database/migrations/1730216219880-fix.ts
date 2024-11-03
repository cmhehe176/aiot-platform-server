import { MigrationInterface, QueryRunner } from "typeorm";

export class Fix1730216219880 implements MigrationInterface {
    name = 'Fix1730216219880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_03f05d2567b1421a6f294d69f45"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_2c8edd9e05f6d807b445e77de13"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_498404ce35391987477a8e10c21"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_63fa749c5cfd18f01e4cf88abfb"`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_5b73d30395a14e08417d608634e" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_1a38dc80c6c70a85f5e882606cb" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_582c1b65b8cdeccf8be267a2234" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_0c9838574f0b90ba5aa25413429" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_0c9838574f0b90ba5aa25413429"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_582c1b65b8cdeccf8be267a2234"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_1a38dc80c6c70a85f5e882606cb"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_5b73d30395a14e08417d608634e"`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_63fa749c5cfd18f01e4cf88abfb" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_498404ce35391987477a8e10c21" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_2c8edd9e05f6d807b445e77de13" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_03f05d2567b1421a6f294d69f45" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
