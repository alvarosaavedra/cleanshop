import {ProductRepositoryInterface} from "../interfaces";
import {getConnection, getRepository, Repository} from "typeorm";
import {injectable} from "inversify";
import {ProductEntity} from "./mappers";
import {Product} from "../Entities/Product";

@injectable()
class ProductInMemoryRepository implements ProductRepositoryInterface {
    private _products: Array<Product> = [];

    async getAll(): Promise<Array<Product>> {
        return this._products;
    }
}

@injectable()
class ProductTypeORMRepository implements ProductRepositoryInterface {

    async getAll(): Promise<Array<Product>> {
        const connection = getConnection('default')
        const repository = connection.getRepository<Product>(ProductEntity);
        return repository.find();
    }
}

export {ProductInMemoryRepository, ProductTypeORMRepository}