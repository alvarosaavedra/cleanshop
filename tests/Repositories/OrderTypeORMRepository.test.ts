import {createConnection} from "typeorm";
import {OrderEntity, ProductEntity} from "../../src/repositories/mappers";
import {OrderTypeORMRepository} from "../../src/repositories/OrderTypeORMRepository";

describe("OrderTypeORMRepository", ()=> {
    it("Should return a Order that has total", async()=> {
        await createConnection({
            name: 'default',
            type: "sqlite",
            database:"database.sqlite",
            logging: false,
            synchronize: false,
            entities: [ProductEntity, OrderEntity],
        });
        const repo = new OrderTypeORMRepository()
        const order = await repo.getById(1)
        expect(order.total).toBe(1000)
    })
})