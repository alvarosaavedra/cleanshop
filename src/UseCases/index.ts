import {ProductRepositoryInterface, ProductUseCasesInterface} from "../interfaces";
import {inject, injectable} from "inversify";
import {TYPES} from "../interfaces/types";
import {Product} from "../Entities/Product";

@injectable()
class ProductsUseCases implements ProductUseCasesInterface {
    private _productRepository: ProductRepositoryInterface ;

    public constructor(
        @inject(TYPES.ProductRepositoryInterface) productRepository: ProductRepositoryInterface
    ) {
        this._productRepository = productRepository;
    }
    async getProducts(): Promise<Array<Product>> {
        return this._productRepository.getAll();
    }
}

export {ProductsUseCases}