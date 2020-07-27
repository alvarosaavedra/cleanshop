import { Request, Response } from "express";
import { ProductsControllerInterface } from "../../../interfaces";
import {myContainer} from "../../../inversify.config";
import {TYPES} from "../../../interfaces/types";

export default [
    {
        path: "/api/v1/products",
        method: "get",
        handler: [
            async ({  }: Request, res: Response) => {
                const controller = myContainer.get<ProductsControllerInterface>(TYPES.ProductsControllerInterface);
                res.status(200).send(await controller.getProducts());
            }
        ]
    }
];