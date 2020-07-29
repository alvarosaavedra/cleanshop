import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOrder1595899089968 implements MigrationInterface {
    name = 'CreateOrder1595899089968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "order"`);
    }

}
