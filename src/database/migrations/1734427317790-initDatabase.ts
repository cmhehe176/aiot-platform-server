import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1734427317790 implements MigrationInterface {
    name = 'InitDatabase1734427317790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "object" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_replied" integer NOT NULL DEFAULT '0', "specs" jsonb NOT NULL, "object_list" jsonb, "event_list" jsonb, CONSTRAINT "PK_05142ce7a16e83c128dab91dfd8" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_object_message_id_timestamp" ON "object" ("timestamp") `);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_replied" integer NOT NULL DEFAULT '0', "CAT" character varying, "payload" jsonb, "external_messages" jsonb, CONSTRAINT "PK_778bab81f1d62286228a6f36047" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_noti_message_id_timestamp" ON "notification" ("timestamp") `);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" SERIAL NOT NULL, "device_id" integer NOT NULL, "message_id" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, "location" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "is_replied" integer NOT NULL DEFAULT '0', "sensor_list" jsonb, CONSTRAINT "PK_2ee4aeda15fe1f535428896f928" PRIMARY KEY ("id", "timestamp"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_sensor_message_id_timestamp" ON "sensor" ("timestamp") `);
        await queryRunner.query(`CREATE TABLE "device" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "project_id" integer, "data" jsonb, "is_active" boolean NOT NULL DEFAULT true, "name" character varying, "mac_address" character varying NOT NULL, "deviceId" character varying NOT NULL, CONSTRAINT "UQ_d3c85068599e55adc8150f665d7" UNIQUE ("mac_address"), CONSTRAINT "UQ_6fe2df6e1c34fc6c18c786ca26e" UNIQUE ("deviceId"), CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_project" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "permission" jsonb NOT NULL, "project_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_66d3e0ccf49c87cd4301523c7da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "role_id" integer NOT NULL DEFAULT '2', "name" character varying NOT NULL, "email" character varying NOT NULL, "telephone" character varying NOT NULL, "thumbnailUrl" text, "password" character varying NOT NULL, "telegram_id" text, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_49568c2027c8bc1f33f7878e189" UNIQUE ("telephone"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer NOT NULL, "name" character varying NOT NULL, "alias" character varying NOT NULL, CONSTRAINT "UQ_7165de494fc9262f6c31965cca1" UNIQUE ("alias"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "support" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "user_id" integer NOT NULL, "admin_id" integer, "title" character varying NOT NULL, "description" text NOT NULL, "reply" text, "method_message" character varying, "is_replied" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_54c6021e6f6912eaaee36b3045d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sub_device" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_id" integer, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_id" integer, "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "type" character varying, "unit" character varying, "description" character varying, "device_id" integer NOT NULL, CONSTRAINT "PK_cff43d098913c561c82c67292ee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "object" ADD CONSTRAINT "FK_2ab9da0e3abd130f1b6bf078ac1" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_c561e3d2a734732fd473200d51e" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sensor" ADD CONSTRAINT "FK_494d5193129326848128d786cdb" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_4ef47f22b7d7a201e20dee04575" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_f6dc0f4c7bfcb642d1ba23b5215" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device" ADD CONSTRAINT "FK_61d9695373207c5e4dc3db7b398" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_2e1f1bca5b63a16ecd6c1c91b70" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project" ADD CONSTRAINT "FK_fa90e828f6c00b76e28a5386295" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_5b73d30395a14e08417d608634e" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_1a38dc80c6c70a85f5e882606cb" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_582c1b65b8cdeccf8be267a2234" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission_project" ADD CONSTRAINT "FK_0c9838574f0b90ba5aa25413429" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_2658d4029dc1bf7529ebb04c047" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_74527ac40d359c0cb803baee032" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_96879ca22261b3846c4fbf9421b" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_257edbfe3e5c7e2a66a5af7a401" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "support" ADD CONSTRAINT "FK_ec6226b3485824ea48a78e9434a" FOREIGN KEY ("admin_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_device" ADD CONSTRAINT "FK_4d2642aea928d2237c9c6169e65" FOREIGN KEY ("created_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_device" ADD CONSTRAINT "FK_f8f668dbf1c0c66d6541b08bf53" FOREIGN KEY ("deleted_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_device" ADD CONSTRAINT "FK_12bf061da853180bb879f754827" FOREIGN KEY ("device_id") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_device" DROP CONSTRAINT "FK_12bf061da853180bb879f754827"`);
        await queryRunner.query(`ALTER TABLE "sub_device" DROP CONSTRAINT "FK_f8f668dbf1c0c66d6541b08bf53"`);
        await queryRunner.query(`ALTER TABLE "sub_device" DROP CONSTRAINT "FK_4d2642aea928d2237c9c6169e65"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_ec6226b3485824ea48a78e9434a"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_d53ceb941621665a8d6b1d1b186"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_257edbfe3e5c7e2a66a5af7a401"`);
        await queryRunner.query(`ALTER TABLE "support" DROP CONSTRAINT "FK_96879ca22261b3846c4fbf9421b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_74527ac40d359c0cb803baee032"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_2658d4029dc1bf7529ebb04c047"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_0c9838574f0b90ba5aa25413429"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_582c1b65b8cdeccf8be267a2234"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_1a38dc80c6c70a85f5e882606cb"`);
        await queryRunner.query(`ALTER TABLE "permission_project" DROP CONSTRAINT "FK_5b73d30395a14e08417d608634e"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_fa90e828f6c00b76e28a5386295"`);
        await queryRunner.query(`ALTER TABLE "project" DROP CONSTRAINT "FK_2e1f1bca5b63a16ecd6c1c91b70"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_61d9695373207c5e4dc3db7b398"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_f6dc0f4c7bfcb642d1ba23b5215"`);
        await queryRunner.query(`ALTER TABLE "device" DROP CONSTRAINT "FK_4ef47f22b7d7a201e20dee04575"`);
        await queryRunner.query(`ALTER TABLE "sensor" DROP CONSTRAINT "FK_494d5193129326848128d786cdb"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_c561e3d2a734732fd473200d51e"`);
        await queryRunner.query(`ALTER TABLE "object" DROP CONSTRAINT "FK_2ab9da0e3abd130f1b6bf078ac1"`);
        await queryRunner.query(`DROP TABLE "sub_device"`);
        await queryRunner.query(`DROP TABLE "support"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "permission_project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "device"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_sensor_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_noti_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_object_message_id_timestamp"`);
        await queryRunner.query(`DROP TABLE "object"`);
    }

}
