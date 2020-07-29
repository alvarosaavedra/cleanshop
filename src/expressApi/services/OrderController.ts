import * as express from "express";
import {interfaces, controller, httpGet, requestParam, response, httpPost, request} from "inversify-express-utils";
import {inject} from "inversify";
import {TYPES} from "../../interfaces/types";
import {OrderUseCasesInterface} from "../../interfaces";
import {Order} from "../../Entities/Order";

@controller("/api/v1/orders")
export class OrderController implements interfaces.Controller {

    constructor(@inject(TYPES.OrderUseCasesInterface) private orderUseCases: OrderUseCasesInterface){}

    @httpGet("/:id")
    public async getOrder(@requestParam("id") id: number, @response() res: express.Response){
        try {
            const order: Order = await this.orderUseCases.getById(id)
            return { ...order, total: order.total };
        }catch (e) {
            return res.status(404).json({error: "Order don't exists"})
        }
    }

    @httpPost("/")
    public async createOrder(@request() req: express.Request, @response() res: express.Response){
        try {
            await this.orderUseCases.createOrder(req.body.productList)
            return res.sendStatus(201)
        }catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    @httpPost("/:id")
    public async updateOrder(
        @requestParam("id") id: number, @request() req: express.Request, @response() res: express.Response){
        const addProductList = req.body.addProductList? req.body.addProductList: []
        const removeProductList = req.body.removeProductList? req.body.removeProductList: []
        try {
            await this.orderUseCases.updateOrder(id, addProductList, removeProductList)
            return res.sendStatus(201)
        }catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
}