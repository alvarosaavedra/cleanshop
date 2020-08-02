import {Product} from "../Entities/Product";
import {Order} from "../Entities/Order";


export interface ProductUseCasesInterface {
    getProducts(): Promise<Array<Product>>;
}

export interface ProductsControllerInterface {
    getProducts(): any;
}

export interface ProductRepositoryInterface {
    getById(id: number): Promise<Product>;
    getAll(): Promise<Array<Product>>;
}

export interface OrderUseCasesInterface {
    getById(id: number): Promise<Order>
    createOrder(idProductList: number[]): Promise<Order>
    updateOrder(id: number, addProductList: number[], removeProductList: number[]): Promise<Order>
    pay(id: number, payMethod: string): Promise<Order>
}

