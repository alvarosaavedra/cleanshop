import { mock } from 'jest-mock-extended';
import "reflect-metadata"; //Must be included so test run correctly https://stackoverflow.com/questions/37534890/inversify-js-reflect-hasownmetadata-is-not-a-function
import {OrderUseCases} from "../../src/UseCases/OrderUseCases";
import {OrderRepositoryInterface} from "../../src/interfaces/OrderRepositoryInterface";
import {ProductRepositoryInterface} from "../../src/interfaces";

function config() {
    const mockOrderRepo = mock<OrderRepositoryInterface>();
    const mockProductRepo = mock<ProductRepositoryInterface>();
    return {mockOrderRepo, mockProductRepo};
}

describe("OrderUseCase", ()=> {
    describe("getById", ()=>{
        it("Should call OrderRepo and return the value", async ()=> {
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessorsFactory = jest.fn((paymentProvider) => paymentProvider)

        })
    })

    describe("pay",() => {
        it("should throw a error if the order don't exists", async ()=> {
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessorsFactory = jest.fn((paymentProvider) => paymentProvider)
            mockOrderRepo.getById.mockRejectedValue(Error("Order no existe"));
            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory)
            await expect(useCase.pay(4, "trsnback")).rejects
                .toThrowError("Order no existe")
        })
        it("should throw error if payment method is not implemented", async ()=>{
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessorsFactory = jest.fn((paymentProvider) => {
                throw Error("Metodo de pago invalido")
            })
            const useCase = new OrderUseCases(
                mockOrderRepo, mockProductRepo, mockProcessorsFactory)
            await expect(useCase.pay(4, "trsnback")).rejects
                 .toThrowError("Metodo de pago invalido")
        })
    })
})