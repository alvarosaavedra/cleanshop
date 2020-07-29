import {injectable} from "inversify";
import {OrderRepositoryInterface} from "../interfaces";
import {Product} from "../Entities/Product";
import {Order} from "../Entities/Order";
import {getRepository} from "typeorm";
import {OrderEntity} from "./mappers";

@injectable()
export class OrderTypeORMRepository implements OrderRepositoryInterface {
    async create(productList: Product[]): Promise<Order> {
        const repository = getRepository<Order>(OrderEntity);
        return repository.save({productos: productList})
    }

    async getById(id: number): Promise<Order> {
        const repository = getRepository<Order>(OrderEntity);
        const object = await repository.findOneOrFail(id)
        return new Order(object.id, object.productos)
    }

    async update(order: Order): Promise<Order> {
        const repository = getRepository<Order>(OrderEntity);
        return repository.save(order)
    }
}