import {Order} from "../../src/Entities/Order";
import {Product} from "../../src/Entities/Product";

describe("Order", ()=> {
    it("should have total", ()=> {
        const order = new Order(1, [new Product(1, "Jabon", 1000, 500)])
        expect(order.total).toBe(1000)
    })
})