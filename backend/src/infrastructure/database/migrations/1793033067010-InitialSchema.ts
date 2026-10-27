import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1793033067010 implements MigrationInterface {
    name = 'InitialSchema1793033067010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'dispatcher')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "initials" character varying(4) NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'dispatcher', "avatar_color" character varying(7) NOT NULL, "company_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hubs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "province" character varying(2) NOT NULL, CONSTRAINT "UQ_8463c24a70afaca27e546d9314a" UNIQUE ("name"), CONSTRAINT "PK_44b53d1f2b4568b26ce4710b843" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_operations_kind_enum" AS ENUM('unloading', 'disposal', 'restack', 'loading')`);
        await queryRunner.query(`CREATE TABLE "order_operations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "kind" "public"."order_operations_kind_enum" NOT NULL, "billable" boolean NOT NULL DEFAULT false, "trailer" character varying, "quantity" integer NOT NULL, "unit" character varying NOT NULL, "applied_at" TIMESTAMP WITH TIME ZONE NOT NULL, "messages_count" integer NOT NULL DEFAULT '0', "photos_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_7d263ffc072d41cd835175b6c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_supplies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "sku" character varying NOT NULL, "category" character varying NOT NULL, "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, CONSTRAINT "PK_d6f793808de5e14e851218f863a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_type_enum" AS ENUM('cross_dock', 'consolidation')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('draft', 'new', 'in_progress', 'completed')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "type" "public"."orders_type_enum" NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'draft', "service_type" character varying, "services" text array NOT NULL DEFAULT '{}', "ref_number" character varying, "alert_message" character varying, "requires_client_action" boolean NOT NULL DEFAULT false, "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL, "declared_standard_qty" integer NOT NULL DEFAULT '0', "declared_xl_qty" integer NOT NULL DEFAULT '0', "actual_qty" integer, "destination" character varying, "destination_note" character varying, "carrier_name" character varying, "carrier_phone" character varying, "truck_number" character varying, "trailer_number" character varying, "trailer_type" character varying, "trailers_count" integer, "dock" character varying, "dock_assigned_at" TIMESTAMP WITH TIME ZONE, "assigned_to" character varying, "warehouse_note" text, "photos_count" integer NOT NULL DEFAULT '0', "photos_required" integer NOT NULL DEFAULT '5', "messages_count" integer NOT NULL DEFAULT '0', "next_action" character varying, "next_action_at" TIMESTAMP WITH TIME ZONE, "total_amount" numeric(12,2), "invoice_number" character varying, "completed_at" TIMESTAMP WITH TIME ZONE, "hub_id" uuid NOT NULL, "company_id" uuid NOT NULL, "created_by_id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4e174e347d448617acdf98fef0d" UNIQUE ("number"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b0d29e66320f81dc885415dd3e" ON "orders" ("company_id", "scheduled_at") `);
        await queryRunner.query(`CREATE TABLE "sub_orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order_id" uuid NOT NULL, "position" integer NOT NULL, "ref_number" character varying NOT NULL, "pallets" integer NOT NULL, "alert_message" character varying, CONSTRAINT "UQ_0f014d812934ad99125acbe36be" UNIQUE ("order_id", "position"), CONSTRAINT "PK_909d792a7f7b751a851223dee9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_operations" ADD CONSTRAINT "FK_faa2a8ab25eeebd1ed34e4881ba" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_supplies" ADD CONSTRAINT "FK_fd2bf1b5ab31c3973955cf7a364" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_d3dd2652247f92fd4021da8d834" FOREIGN KEY ("hub_id") REFERENCES "hubs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f5d519a61e918f7efb299de31a0" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f93cc7892226abb9c88e7131381" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sub_orders" ADD CONSTRAINT "FK_f6fdc0f65057389bcdb58575b9a" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sub_orders" DROP CONSTRAINT "FK_f6fdc0f65057389bcdb58575b9a"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f93cc7892226abb9c88e7131381"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f5d519a61e918f7efb299de31a0"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_d3dd2652247f92fd4021da8d834"`);
        await queryRunner.query(`ALTER TABLE "order_supplies" DROP CONSTRAINT "FK_fd2bf1b5ab31c3973955cf7a364"`);
        await queryRunner.query(`ALTER TABLE "order_operations" DROP CONSTRAINT "FK_faa2a8ab25eeebd1ed34e4881ba"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`);
        await queryRunner.query(`DROP TABLE "sub_orders"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0d29e66320f81dc885415dd3e"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_type_enum"`);
        await queryRunner.query(`DROP TABLE "order_supplies"`);
        await queryRunner.query(`DROP TABLE "order_operations"`);
        await queryRunner.query(`DROP TYPE "public"."order_operations_kind_enum"`);
        await queryRunner.query(`DROP TABLE "hubs"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
