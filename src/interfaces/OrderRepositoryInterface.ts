import {Order} from "../Entities/Order";
import {Product} from "../Entities/Product";

export interface OrderRepositoryInterface {
    getById(id: number): Promise<Order>

    create(productList: Product[]): Promise<Order>

    update(order: Order): Promise<Order>
}