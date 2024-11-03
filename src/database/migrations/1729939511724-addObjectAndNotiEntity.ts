import { MigrationInterface, QueryRunner } from "typeorm";

export class AddObjectAndNotiEntity1729939511724 implements MigrationInterface {
    name = 'AddObjectAndNotiEntity1729939511724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "object" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "data" jsonb NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "specs" jsonb NOT NULL, "object_list" jsonb, "event_list" jsonb, "notification_id" integer, CONSTRAINT "PK_05142ce7a16e83c128dab91dfd8" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_object_message_id_timestamp" ON "object" ("timestamp") `);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "data" jsonb NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "CAT" character varying, "payload" jsonb, "external_messages" jsonb, CONSTRAINT "PK_778bab81f1d62286228a6f36047" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_noti_message_id_timestamp" ON "notification" ("timestamp") `);
        await queryRunner.query(`ALTER TABLE "object" ADD CONSTRAINT "FK_2ab9da0e3abd130f1b6bf078ac1" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c561e3d2a734732fd473200d51e" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`SELECT create_hypertable('notification', 'timestamp');`);
        await queryRunner.query(`SELECT create_hypertable('object', 'timestamp');`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c561e3d2a734732fd473200d51e"`);
        await queryRunner.query(`ALTER TABLE "object" DROP CONSTRAINT "FK_2ab9da0e3abd130f1b6bf078ac1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_noti_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_object_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "object"`);
    }

}
