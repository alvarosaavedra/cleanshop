import { inject } from "inversify";
import {ProductUseCasesInterface} from "../../interfaces";
import { TYPES } from "../../interfaces/types";
import {interfaces, controller, httpGet} from "inversify-express-utils";

@controller("/api/v1/products")
class ProductsController implements interfaces.Controller {

    constructor(@inject(TYPES.ProductUseCasesInterface) private productUseCase: ProductUseCasesInterface) {}

    @httpGet("/")
    public async getProducts() {
        const result = await this.productUseCase.getProducts()
        return {
            type: "ProductCollection",
            products: result
        };
    };
}

export { ProductsController }