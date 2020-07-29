import {ProductRepositoryInterface} from "../interfaces";
import {injectable} from "inversify";
import {Product} from "../Entities/Product";

@injectable()
export class ProductInMemoryRepository implements ProductRepositoryInterface {
    private _products: Array<Product> = [];

    async getAll(): Promise<Array<Product>> {
        return this._products;
    }

    async getById(id: number): Promise<Product> {
        const result = this._products.find((product)=> product.id === id);
        if (!result) {
            throw new Error("Producto no existe")
        }
        return result
    }
}

