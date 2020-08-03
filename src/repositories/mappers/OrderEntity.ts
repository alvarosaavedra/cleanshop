import {EntitySchema} from "typeorm/index";
import {Product} from "../../Entities/Product";
import {Order} from "../../Entities/Order";

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
});