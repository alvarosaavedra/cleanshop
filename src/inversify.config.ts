import { Container } from "inversify";
import {
    OrderUseCasesInterface,
    ProductRepositoryInterface,
    ProductUseCasesInterface
} from "./interfaces";
import {TYPES} from "./interfaces/types";
import {OrderUseCases} from "./UseCases/OrderUseCases";
import {ProductsController} from "./expressApi/services/ProductsController";
import {interfaces} from "inversify-express-utils";
import {OrderController} from "./expressApi/services/OrderController";
import {ProductsUseCases} from "./UseCases/ProductUseCases";
import {ProductTypeORMRepository} from "./repositories/ProductTypeORMRepository";
import {OrderTypeORMRepository} from "./repositories/OrderTypeORMRepository";
import {OrderRepositoryInterface} from "./interfaces/OrderRepositoryInterface";

const containerConfigurator = (container: Container): Container => {
    container.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductTypeORMRepository);
    container.bind<OrderRepositoryInterface>(TYPES.OrderRepositoryInterface).to(OrderTypeORMRepository);
    container.bind<ProductUseCasesInterface>(TYPES.ProductUseCasesInterface).to(ProductsUseCases);
    container.bind<OrderUseCasesInterface>(TYPES.OrderUseCasesInterface).to(OrderUseCases);
    container.bind<interfaces.Controller>('ProductsController').to(ProductsController)
    container.bind<interfaces.Controller>('OrderController').to(OrderController)
    return container
}



export {containerConfigurator}