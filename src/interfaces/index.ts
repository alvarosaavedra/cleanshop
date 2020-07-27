import {Product} from "../Entities/Product";


export interface ProductUseCasesInterface {
    getProducts(): Promise<Array<Product>>;
}

export interface ProductsControllerInterface {
    getProducts(): any;
}

export interface ProductRepositoryInterface {
    getAll(): Promise<Array<Product>>;
}