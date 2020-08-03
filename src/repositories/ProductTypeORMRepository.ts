import {injectable} from "inversify";
import {ProductRepositoryInterface} from "../interfaces";
import {Product} from "../Entities/Product";
import {getRepository} from "typeorm";
import {ProductEntity} from "./mappers/ProductEntity";

@injectable()
export class ProductTypeORMRepository implements ProductRepositoryInterface {

    async getAll(): Promise<Array<Product>> {
        const repository = getRepository<Product>(ProductEntity);
        return repository.find();
    }

    getById(id: number): Promise<Product> {
        const repository = getRepository<Product>(ProductEntity);
        return repository.findOneOrFail({where: {id: id}})
    }
}