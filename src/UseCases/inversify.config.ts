import {OrderUseCasesInterface, PaymentProcessorInterface, ProductUseCasesInterface} from "../interfaces";
import {Container, interfaces as inversifyInterfaces } from "inversify";
import {TYPES} from "../interfaces/types";
import {ProductsUseCases} from "./ProductUseCases";
import {OrderUseCases} from "./OrderUseCases";

export class NotImplemented extends Error {}

export const containerConfiguratorUseCases = (container: Container): Container => {
    container.bind<ProductUseCasesInterface>(TYPES.ProductUseCasesInterface).to(ProductsUseCases);
    container.bind<OrderUseCasesInterface>(TYPES.OrderUseCasesInterface).to(OrderUseCases);
    container.bind<inversifyInterfaces.Factory<PaymentProcessorInterface>>(
        "Factory<PaymentProcessorInterface>")
        .toFactory<PaymentProcessorInterface>((_context: inversifyInterfaces.Context) => {
        return (_paymentMethod: string) => {
            throw new NotImplemented("Metodo de pago invalido")
        };
    });
    return container
}


