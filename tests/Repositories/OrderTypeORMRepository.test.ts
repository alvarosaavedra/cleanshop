import {createConnection} from "typeorm";
import {OrderEntity} from "../../src/repositories/mappers/OrderEntity";
import {OrderTypeORMRepository} from "../../src/repositories/OrderTypeORMRepository";
import {ProductEntity} from "../../src/repositories/mappers/ProductEntity";
import {Order} from "../../src/Entities/Order";

async function config() {
    const connection = await createConnection({
        name: 'default',
        type: "sqlite",
        database: "database.test.sqlite",
        logging: false,
        synchronize: true,
        migrationsRun: true,
        dropSchema: true,
        entities: [ProductEntity, OrderEntity],
        migrations: ["../../src/repositories/mappers/migrations/*.ts"]
    });
    const orderInitial = new Order(null, [])
    await connection.manager.save(orderInitial);
}

describe("OrderTypeORMRepository", ()=> {
    it("Should return a Order that has total", async()=> {
        await config();
        const repo = new OrderTypeORMRepository()
        const order = await repo.getById(1)
        expect(order.total).toBe(0)
    })
})