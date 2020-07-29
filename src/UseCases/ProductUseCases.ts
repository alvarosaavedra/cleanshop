import {inject, injectable} from "inversify";
import {ProductRepositoryInterface, ProductUseCasesInterface} from "../interfaces";
import {TYPES} from "../interfaces/types";
import {Product} from "../Entities/Product";

@injectable()
export class ProductsUseCases implements ProductUseCasesInterface {

    public constructor(
        @inject(TYPES.ProductRepositoryInterface) private productRepository: ProductRepositoryInterface
    ) {
    }

    async getProducts(): Promise<Array<Product>> {
        return this.productRepository.getAll();
    }
}