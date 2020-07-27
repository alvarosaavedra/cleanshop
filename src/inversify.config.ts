import { Container } from "inversify";
import {ProductRepositoryInterface, ProductsControllerInterface, ProductUseCasesInterface} from "./interfaces";
import {TYPES} from "./interfaces/types";
import {ProductInMemoryRepository, ProductTypeORMRepository} from "./repositories";
import {ProductsUseCases} from "./UseCases";
import {ProductsController} from "./expressApi/services/products/ProductsController";

const myContainer = new Container();
myContainer.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductTypeORMRepository);
myContainer.bind<ProductUseCasesInterface>(TYPES.ProductUseCasesInterface).to(ProductsUseCases);
myContainer.bind<ProductsControllerInterface>(TYPES.ProductsControllerInterface).to(ProductsController);



export {myContainer}