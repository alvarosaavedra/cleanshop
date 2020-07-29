import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateOrder1595941486041 implements MigrationInterface {
    name = 'CreateOrder1595941486041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_productos_product" ("orderId" integer NOT NULL, "productId" integer NOT NULL, PRIMARY KEY ("orderId", "productId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5ac1f6b4e13a3d74482435e4af" ON "order_productos_product" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a79b71221bb5a337ab8bb8c23" ON "order_productos_product" ("productId") `);
        await queryRunner.query(`DROP INDEX "IDX_5ac1f6b4e13a3d74482435e4af"`);
        await queryRunner.query(`DROP INDEX "IDX_8a79b71221bb5a337ab8bb8c23"`);
        await queryRunner.query(`CREATE TABLE "temporary_order_productos_product" ("orderId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "FK_5ac1f6b4e13a3d74482435e4afd" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8a79b71221bb5a337ab8bb8c233" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("orderId", "productId"))`);
        await queryRunner.query(`INSERT INTO "temporary_order_productos_product"("orderId", "productId") SELECT "orderId", "productId" FROM "order_productos_product"`);
        await queryRunner.query(`DROP TABLE "order_productos_product"`);
        await queryRunner.query(`ALTER TABLE "temporary_order_productos_product" RENAME TO "order_productos_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_5ac1f6b4e13a3d74482435e4af" ON "order_productos_product" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a79b71221bb5a337ab8bb8c23" ON "order_productos_product" ("productId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_8a79b71221bb5a337ab8bb8c23"`);
        await queryRunner.query(`DROP INDEX "IDX_5ac1f6b4e13a3d74482435e4af"`);
        await queryRunner.query(`ALTER TABLE "order_productos_product" RENAME TO "temporary_order_productos_product"`);
        await queryRunner.query(`CREATE TABLE "order_productos_product" ("orderId" integer NOT NULL, "productId" integer NOT NULL, PRIMARY KEY ("orderId", "productId"))`);
        await queryRunner.query(`INSERT INTO "order_productos_product"("orderId", "productId") SELECT "orderId", "productId" FROM "temporary_order_productos_product"`);
        await queryRunner.query(`DROP TABLE "temporary_order_productos_product"`);
        await queryRunner.query(`CREATE INDEX "IDX_8a79b71221bb5a337ab8bb8c23" ON "order_productos_product" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5ac1f6b4e13a3d74482435e4af" ON "order_productos_product" ("orderId") `);
        await queryRunner.query(`DROP INDEX "IDX_8a79b71221bb5a337ab8bb8c23"`);
        await queryRunner.query(`DROP INDEX "IDX_5ac1f6b4e13a3d74482435e4af"`);
        await queryRunner.query(`DROP TABLE "order_productos_product"`);
    }

}
