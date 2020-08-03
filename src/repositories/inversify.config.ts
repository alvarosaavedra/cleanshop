import {Container} from "inversify";
import {ProductRepositoryInterface} from "../interfaces";
import {TYPES} from "../interfaces/types";
import {ProductTypeORMRepository} from "./ProductTypeORMRepository";
import {OrderRepositoryInterface} from "../interfaces/OrderRepositoryInterface";
import {OrderTypeORMRepository} from "./OrderTypeORMRepository";

export const containerConfiguratorRepositories = (container: Container): Container => {
    container.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductTypeORMRepository);
    container.bind<OrderRepositoryInterface>(TYPES.OrderRepositoryInterface).to(OrderTypeORMRepository);
    return container;
}
