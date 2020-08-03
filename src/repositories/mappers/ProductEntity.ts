import {Product} from "../../Entities/Product";
import {EntitySchema} from "typeorm/index";

export const ProductEntity: EntitySchema<Product> = new EntitySchema<Product>({
    name: Product.name,
    tableName: "product",
    target: Product,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        nombre: {
            type: String
        },
        precio: {
            type: Number
        },
        costo: {
            type: Number
        }
    }
});