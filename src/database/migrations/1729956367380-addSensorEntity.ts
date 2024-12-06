import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSensorEntity1729956367380 implements MigrationInterface {
    name = 'AddSensorEntity1729956367380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sensor" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "data" jsonb NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "specs" jsonb NOT NULL, "sensor_list" jsonb, CONSTRAINT "PK_2ee4aeda15fe1f535428896f928" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_sensor_message_id_timestamp" ON "sensor" ("timestamp") `);
        await queryRunner.query(`ALTER TABLE "object" DROP COLUMN "notification_id"`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_494d5193129326848128d786cdb" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`SELECT create_hypertable('sensor', 'timestamp');`);
  
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_494d5193129326848128d786cdb"`);
        await queryRunner.query(`ALTER TABLE "object" ADD "notification_id" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_sensor_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
    }

}
