import {OrderUseCasesInterface, PaymentProcessorInterface, ProductRepositoryInterface} from "../interfaces";
import {inject, injectable} from "inversify";
import {TYPES} from "../interfaces/types";
import {Order} from "../Entities/Order";
import {OrderRepositoryInterface} from "../interfaces/OrderRepositoryInterface";

@injectable()
export class OrderUseCases implements OrderUseCasesInterface {
    public constructor(
        @inject(TYPES.OrderRepositoryInterface) private orderRepository: OrderRepositoryInterface,
        @inject(TYPES.ProductRepositoryInterface) private productRepository: ProductRepositoryInterface,
        @inject("Factory<PaymentProcessorInterface>") private paymentProcessorFactory:
            (paymentMethod: string)=> PaymentProcessorInterface,
    ) {}
    async getById(id: number): Promise<Order> {
        return this.orderRepository.getById(id);
    }

    async createOrder(idProductList: number[]): Promise<Order> {
        const productList = await Promise.all(idProductList.map((id) => this.productRepository.getById(id)))
        return this.orderRepository.create(productList);
    }

    async updateOrder(id: number, addProductList: [], removeProductList: number[]): Promise<Order> {
        const order = await this.orderRepository.getById(id);
        order.productos = order.productos.filter((producto) => !removeProductList.includes(producto.id) )
        const newProductList = await Promise.all(addProductList.map((id) => this.productRepository.getById(id)))
        order.productos = [...order.productos, ...newProductList]
        return await this.orderRepository.update(order)
    }

    async pay(id: number, payMethod: string): Promise<Order> {
        const order = await this.orderRepository.getById(id)
        const paymentProcessor = this.paymentProcessorFactory(payMethod);
        return order;
    }

}