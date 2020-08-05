import request from "supertest";
import App from "../../../src/expressApi/App";
import {Container} from "inversify";
import {interfaces} from "inversify-express-utils";
import {OrderController} from "../../../src/expressApi/services/OrderController";
import {OrderUseCasesInterface} from "../../../src/interfaces";
import {TYPES} from "../../../src/interfaces/types";
import {mock} from "jest-mock-extended";
import {EntityNotFoundError} from "../../../src/repositories/Errors";
import {Order} from "../../../src/Entities/Order";
import {NotImplemented} from "../../../src/UseCases/inversify.config";

function config() {
    const mockOrderUseCase = mock<OrderUseCasesInterface>()
    const configuration = (container: Container) => {
        container.bind<interfaces.Controller>('OrderController').to(OrderController)
        container.bind<OrderUseCasesInterface>(TYPES.OrderUseCasesInterface).toConstantValue(mockOrderUseCase);
        return container
    }
    const app = new App(3001, [configuration], false).server.build()
    return {mockOrderUseCase, app};
}

describe("OrderController", ()=>{
    describe("GET /api/v1/orders/:id", ()=>{
        it("should return 404 if order don't exists", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.getById.mockRejectedValue(new EntityNotFoundError("Order no existe"))
            request(app)
                .get('/api/v1/orders/1')
                .expect(404)
                .end(function(err, res) {
                    if (err) throw err;
                    expect(res.body).toHaveProperty("error")
                    expect(res.body.error).toBe("Order don't exists")

                    done()
                });
        })

        it("should return a json representation of a Order including products and total", 
            (done) => {
                const {mockOrderUseCase, app} = config();
                mockOrderUseCase.getById.mockResolvedValue(new Order(1, []));
                request(app)
                    .get('/api/v1/orders/1')
                    .expect(200)
                    .end(function(err, res) {
                        if (err) throw err;
                        expect(res.body).toHaveProperty("total")
                        expect(res.body).toHaveProperty("productos")
                        done()
                    });

        })
    })
    describe("POST /api/v1/orders", ()=>{
        it("Should return 400 if productList is not sent", (done)=>{
            const {app} = config();
            request(app)
                .post('/api/v1/orders')
                .send({
                })
                .expect(400)
                .end(function(err, res) {
                    if (err) throw err;
                    expect(res.body).toHaveProperty("error")
                    done()
                });
        })
        it("Should return 404 if any of products don't exists", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.createOrder.mockRejectedValue(new EntityNotFoundError("One of the products don't exists"))
            request(app)
                .post('/api/v1/orders')
                .send({
                    productList: []
                })
                .expect(404)
                .end(function(err, res) {
                    if (err) throw err;
                    expect(res.body).toHaveProperty("error")
                    done()
                });
        })
        it("Should return 201 if all OK", (done)=>{
            const {app} = config();
            request(app)
                .post('/api/v1/orders')
                .send({
                    productList: []
                })
                .expect(201)
                .end(function(err, _res) {
                    if (err) throw err;
                    done()
                });
        })
    })
    describe("POST /api/v1/orders/:id", ()=> {
        it("Should return 404 if order don't exists", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.updateOrder.mockRejectedValue(new EntityNotFoundError("Order not found"))
            request(app)
                .post("/api/v1/orders/:id")
                .send({})
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.error).toBe("Order not found")
                    done()
                })
        })
        it("Should return 404 if any product don't exists", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.updateOrder.mockRejectedValue(new EntityNotFoundError("Product not found"))
            request(app)
                .post("/api/v1/orders/:id")
                .send({
                    addProductList: [1]
                })
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.error).toBe("Product not found")
                    done()
                })
        })
        it("Should return 200 if all OK", (done)=>{
            const {app} = config();
            request(app)
                .post("/api/v1/orders/:id")
                .send({
                    paymentProvider: "traspbak"
                })
                .expect(201)
                .end((err, _res) => {
                    if (err) throw err;
                    done()
                })
        })

    })
    describe("POST /api/v1/orders/:id/pay", ()=> {
        it("Should return 400 if no payment provider is sent", (done)=>{
            const {app} = config();
            request(app)
                .post("/api/v1/orders/:id/pay")
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.error).toBe("paymentProvider required")
                    done()
                })
        })
        it("Should return 404 if order don't exists", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.pay.mockRejectedValue(new EntityNotFoundError("Order not found"))
            request(app)
                .post("/api/v1/orders/:id/pay")
                .send({
                    paymentProvider: "traspbak"
                })
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.error).toBe("Order not found")
                    done()
                })
        })
        it("Should return 404 if paymentProvider is not implemented", (done)=>{
            const {mockOrderUseCase, app} = config();
            mockOrderUseCase.pay.mockRejectedValue(
                new NotImplemented("This payment provider has no processor Implemented"))
            request(app)
                .post("/api/v1/orders/:id/pay")
                .send({
                    paymentProvider: "traspbak"
                })
                .expect(404)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.error).toBe("This payment provider has no processor Implemented")
                    done()
                })
        })
        it("Should return 200 if all OK", (done)=>{
            const {app} = config();
            request(app)
                .post("/api/v1/orders/:id/pay")
                .send({
                    paymentProvider: "traspbak"
                })
                .expect(201)
                .end((err, _res) => {
                    if (err) throw err;
                    done()
                })
        })

    })
})