import {Container} from "inversify";
import {interfaces} from "inversify-express-utils";
import {ProductsController} from "./services/ProductsController";
import {OrderController} from "./services/OrderController";


export const containerConfiguratorApi = (container: Container): Container => {
    container.bind<interfaces.Controller>('ProductsController').to(ProductsController)
    container.bind<interfaces.Controller>('OrderController').to(OrderController)
    return container
}
