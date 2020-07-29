import {Product} from "./Product";

export class Order {
    constructor(public id: number|null, public productos: Product[]) {
    }

    get total(): number {
        return this.productos.reduce((total, producto)=> producto.precio, 0)
    }
}