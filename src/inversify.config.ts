import { Container } from "inversify";
import {ProductRepositoryInterface, ProductsControllerInterface, ProductUseCasesInterface} from "./interfaces";
import {TYPES} from "./interfaces/types";
import {ProductTypeORMRepository} from "./repositories";
import {ProductsUseCases} from "./UseCases";
import {ProductsController} from "./expressApi/services/products/ProductsController";
import {interfaces} from "inversify-express-utils";

const containerConfigurator = (container: Container): Container => {
    container.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductTypeORMRepository);
    container.bind<ProductUseCasesInterface>(TYPES.ProductUseCasesInterface).to(ProductsUseCases);
    container.bind<interfaces.Controller>('ProductsController').to(ProductsController)
    return container
}



export {containerConfigurator}