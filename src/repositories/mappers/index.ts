import {EntitySchema} from "typeorm";
import {Product} from "../../Entities/Product";
import {Order} from "../../Entities/Order";

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

export const OrderEntity: EntitySchema<Order> = new EntitySchema<Order>({
    name: Order.name,
    tableName: 'order',
    target: Order,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },

    },
    relations: {
        productos: {
            type: "many-to-many",
            target: Product.name,
            joinTable: true,
            eager: true
        }
    }
})