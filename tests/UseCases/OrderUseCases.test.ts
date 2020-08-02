import { mock } from 'jest-mock-extended';
import "reflect-metadata"; //Must be included so test run correctly https://stackoverflow.com/questions/37534890/inversify-js-reflect-hasownmetadata-is-not-a-function
import {OrderUseCases} from "../../src/UseCases/OrderUseCases";
import {OrderRepositoryInterface} from "../../src/interfaces/OrderRepositoryInterface";
import {ProductRepositoryInterface} from "../../src/interfaces";

describe("OrderUseCase", ()=> {
    describe("pay",() => {
        it("should throw a error if the order don't exists", async ()=> {
            const mockOrderRepo = mock<OrderRepositoryInterface>();
            const mockProductRepo = mock<ProductRepositoryInterface>();
            mockOrderRepo.getById.mockRejectedValue(Error("Order no existe"));
            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, (method: any) => method)
            await expect(useCase.pay(4, "trsnback")).rejects
                .toThrowError("Order no existe")
        })
        it("should throw error if payment method is not implemented", async ()=>{
            const mockOrderRepo = mock<OrderRepositoryInterface>();
            const mockProductRepo = mock<ProductRepositoryInterface>();
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