import {MigrationInterface, QueryRunner} from "typeorm";

export class ProductInitialMigration1595708992308 implements MigrationInterface {
    name = 'ProductInitialMigration1595708992308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar NOT NULL, "precio" integer NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
