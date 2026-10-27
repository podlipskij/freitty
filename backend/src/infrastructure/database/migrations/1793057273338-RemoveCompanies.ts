import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCompanies1793057273338 implements MigrationInterface {
    name = 'RemoveCompanies1793057273338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "balance" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`UPDATE "users" u SET "balance" = c."balance" FROM "companies" c WHERE c."id" = u."company_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "customer" character varying`);
        await queryRunner.query(`UPDATE "orders" o SET "customer" = c."name" FROM "companies" c WHERE c."id" = o."company_id"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "customer" SET NOT NULL`);

        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f5d519a61e918f7efb299de31a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0d29e66320f81dc885415dd3e"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "company_id"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "company_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_8e23d5fa98b3ef595f946050b3" ON "orders" ("scheduled_at") `);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "balance" numeric(12,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "companies" ("name", "balance") VALUES (COALESCE((SELECT "customer" FROM "orders" LIMIT 1), 'Company'), COALESCE((SELECT MAX("balance") FROM "users"), 0))`);

        await queryRunner.query(`ALTER TABLE "users" ADD "company_id" uuid`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "company_id" uuid`);
        await queryRunner.query(`UPDATE "users" SET "company_id" = (SELECT "id" FROM "companies" LIMIT 1)`);
        await queryRunner.query(`UPDATE "orders" SET "company_id" = (SELECT "id" FROM "companies" LIMIT 1)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "company_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "company_id" SET NOT NULL`);

        await queryRunner.query(`DROP INDEX "public"."IDX_8e23d5fa98b3ef595f946050b3"`);
        await queryRunner.query(`CREATE INDEX "IDX_b0d29e66320f81dc885415dd3e" ON "orders" ("company_id", "scheduled_at") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f5d519a61e918f7efb299de31a0" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "customer"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance"`);
    }

}
