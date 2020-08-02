import request from "supertest";
import App from "../../../src/expressApi/App";
import {containerConfigurator} from "../../../src/inversify.config";

describe("OrderController", ()=>{
    describe("GET /api/v1/orders/:id", ()=>{
        it("should return 404 if order don't exists", async ()=>{
            const app = new App(3001, [containerConfigurator])
            request(app)
                .get('/api/v1/orders/1')
                .expect(404)
        })
    })
})