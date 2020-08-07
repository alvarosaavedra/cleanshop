import { mock } from 'jest-mock-extended';
import "reflect-metadata"; //Must be included so test run correctly https://stackoverflow.com/questions/37534890/inversify-js-reflect-hasownmetadata-is-not-a-function
import {OrderUseCases} from "../../src/UseCases/OrderUseCases";
import {OrderRepositoryInterface} from "../../src/interfaces/OrderRepositoryInterface";
import {ProductRepositoryInterface} from "../../src/interfaces";
import {EntityNotFoundError} from "../../src/repositories/Errors";

function config() {
    const mockOrderRepo = mock<OrderRepositoryInterface>();
    const mockProductRepo = mock<ProductRepositoryInterface>();
    const mockProcessorsFactory = jest.fn()
    return {mockOrderRepo, mockProductRepo, mockProcessorsFactory};
}

describe("OrderUseCase", ()=> {
    describe("getById", ()=>{
        it("Should throw EntityNotFoundError if order don't exist", async () => {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockOrderRepo.getById.mockRejectedValue(new EntityNotFoundError("Order not found"))

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);

            await expect(useCase.getById(1)).rejects.toThrowError(new EntityNotFoundError("Order not found"));
        })

        it("Should call OrderRepo getById and return the value", async () => {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            const expectedValue = {id:1, productos: [], total: 0};
            mockOrderRepo.getById.mockResolvedValue(expectedValue);

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            const actualValue = await useCase.getById(1);

            expect(mockOrderRepo.getById).toBeCalledWith(1);
            expect(actualValue).toBe(expectedValue);
        })
    })

    describe("createOrder", ()=>{
        it("Should throw EntityNotFoundError if any of the products don't exists", async ()=> {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockProductRepo.getById.mockRejectedValue(new EntityNotFoundError("Product don't exists"))

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            await expect(useCase.createOrder([1])).rejects.toThrowError(
                new EntityNotFoundError("Product don't exists"))
        })
        it("Should call OrderRepository.create using a list of products and return the order", async ()=>{
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            const expectedValue = {id:1, productos: [], total: 0};
            mockOrderRepo.create.mockResolvedValue(expectedValue)

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            const actualResponse = await useCase.createOrder([1])

            expect(actualResponse).toBe(expectedValue)
        })
    })

    describe("pay",() => {
        it("should throw a error if the order don't exists", async () => {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockOrderRepo.getById.mockRejectedValue(Error("Order no existe"));

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory)

            await expect(useCase.pay(4, "trsnback")).rejects
                .toThrowError("Order no existe")
        })
        it("should throw error if payment method is not implemented", async () =>{
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessorsFactory = jest.fn((_paymnetProvider)=> {
                throw new Error("Metodo de pago invalido");
            })

            const useCase = new OrderUseCases(
                mockOrderRepo, mockProductRepo, mockProcessorsFactory)

            await expect(useCase.pay(4, "trsnback")).rejects
                 .toThrowError("Metodo de pago invalido")
        })
    })
})