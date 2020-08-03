import request from "supertest";
import App from "../../../src/expressApi/App";
import {Container} from "inversify";
import {interfaces} from "inversify-express-utils";
import {OrderController} from "../../../src/expressApi/services/OrderController";
import {OrderUseCasesInterface} from "../../../src/interfaces";
import {TYPES} from "../../../src/interfaces/types";
import {mock} from "jest-mock-extended";
import {Order} from "../../../src/Entities/Order";

describe("OrderController", ()=>{
    describe("GET /api/v1/orders/:id", ()=>{
        it("should return 404 if order don't exists", async ()=>{
            const mockOrderUseCase = mock<OrderUseCasesInterface>()
            const configuration = (container: Container) => {
                container.bind<interfaces.Controller>('OrderController').to(OrderController)
                container.bind<OrderUseCasesInterface>(TYPES.OrderUseCasesInterface).toConstantValue(mockOrderUseCase);
                return container
            }
            const app = new App(3001, [configuration])
            mockOrderUseCase.getById.mockReturnValue(new Promise<Order>((resolve, reject) => new Order(1, [])))
            request(app)
                .get('/api/v1/orders/1')
                .expect(404)
        })
    })
})