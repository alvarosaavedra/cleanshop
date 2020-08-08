import { mock } from 'jest-mock-extended';
import "reflect-metadata"; //Must be included so test run correctly https://stackoverflow.com/questions/37534890/inversify-js-reflect-hasownmetadata-is-not-a-function
import {OrderUseCases} from "../../src/UseCases/OrderUseCases";
import {OrderRepositoryInterface} from "../../src/interfaces/OrderRepositoryInterface";
import {PaymentProcessorInterface, ProductRepositoryInterface} from "../../src/interfaces";
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
            mockOrderRepo.getById.mockRejectedValue(new EntityNotFoundError("Order not found"));

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
            mockProductRepo.getById.mockRejectedValue(new EntityNotFoundError("Product don't exists"));

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            await expect(useCase.createOrder([1])).rejects.toThrowError(
                new EntityNotFoundError("Product don't exists"));
        })
        it("Should call OrderRepository.create using a list of products and return the order", async ()=>{
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            const expectedValue = {id:1, productos: [], total: 0};
            mockOrderRepo.create.mockResolvedValue(expectedValue);

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            const actualResponse = await useCase.createOrder([1]);

            expect(actualResponse).toBe(expectedValue);
        })
    })

    describe("updateOrder", ()=>{
        it("Should throw EntityNotFoundError if any of the products on the add list don't exists",
            async ()=> {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockOrderRepo.getById.mockResolvedValue({id: 1, productos: [], total: 0});
            mockProductRepo.getById.mockRejectedValue(new EntityNotFoundError("Product don't exists"));

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            await expect(useCase.updateOrder(1,[1], [])).rejects.toThrowError(
                new EntityNotFoundError("Product don't exists"));
        })

        it("Should call orderRepository.update using a updated order", async ()=> {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockOrderRepo.getById.mockResolvedValue({
                id: 1,
                productos: [
                    {id: 2, nombre: "Toy", precio: 10000, costo: 5000, margen(): number { return 5000 }},
                ],
                total: 10000
            });

            const mockProductExpected = {
                id:1, nombre: "Jabon", precio: 2000, costo: 500, margen(): number { return 1500}};

            mockProductRepo.getById.mockResolvedValue(mockProductExpected)
            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            await useCase.updateOrder(1, [1], [2]);

            const expectedOrder = {
                id: 1,
                productos: [mockProductExpected],
                total: 10000
            };

            expect(mockOrderRepo.update).toBeCalledWith(expectedOrder);
        })
    })

    describe("pay",() => {
        it("should throw a error if the order don't exists", async () => {
            const {mockOrderRepo, mockProductRepo, mockProcessorsFactory} = config();
            mockOrderRepo.getById.mockRejectedValue(Error("Order no existe"));

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);

            await expect(useCase.pay(4, "trsnback")).rejects
                .toThrowError("Order no existe");
        })
        it("should throw error if payment method is not implemented", async () =>{
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessorsFactory = jest.fn((_paymentProvider)=> {
                throw new Error("Metodo de pago invalido");
            })

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);

            await expect(useCase.pay(4, "trsnback")).rejects
                 .toThrowError("Metodo de pago invalido");
        })
        it("Should call process of the processor using the order as parameter", async () => {
            const {mockOrderRepo, mockProductRepo} = config();
            const mockProcessor = mock<PaymentProcessorInterface>();
            const mockOrder = { id:4, productos: [], total: 0 };
            mockOrderRepo.getById.mockResolvedValue(mockOrder);
            const mockProcessorsFactory = jest.fn(_paymentProvider => mockProcessor);

            const useCase = new OrderUseCases(mockOrderRepo, mockProductRepo, mockProcessorsFactory);
            await useCase.pay(4, "trsnback");

            expect(mockProcessorsFactory.mock.calls.length).toBe(1)
            expect(mockProcessorsFactory.mock.calls[0][0]).toBe("trsnback")
            expect(mockProcessor.process).toBeCalledWith(mockOrder)

        })
    })
})