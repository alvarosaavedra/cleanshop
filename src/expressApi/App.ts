import express from 'express';
import { createConnection, Connection } from 'typeorm';
import {interfaces, InversifyExpressServer} from "inversify-express-utils";
import {Container} from "inversify";
import {ProductRepositoryInterface, ProductUseCasesInterface} from "../interfaces";
import {TYPES} from "../interfaces/types";
import {ProductInMemoryRepository, ProductTypeORMRepository} from "../repositories";
import {ProductsUseCases} from "../UseCases";
import "./services/products/ProductsController";
import {ProductsController} from "./services/products/ProductsController";
import {ProductEntity} from "../repositories/mappers";

class App {
    public server: InversifyExpressServer;
    public port: number;
    public connection: Connection | undefined; // TypeORM connection to the database

    // The constructor receives an array with instances of the controllers for the application and an integer to designate the port number.
    constructor(port: number) {
        let container = new Container();
        container.bind<ProductRepositoryInterface>(TYPES.ProductRepositoryInterface).to(ProductTypeORMRepository);
        container.bind<ProductUseCasesInterface>(TYPES.ProductUseCasesInterface).to(ProductsUseCases);
        container.bind<interfaces.Controller>('ProductsController').to(ProductsController)
        this.server = new InversifyExpressServer(container);
        this.port = port;
        this.initializeModels();
        this.initializeMiddlewares();
    }

    private async initializeModels() {
        const connection = await createConnection({
            name: 'default',
            type: "sqlite",
            database:"database.sqlite",
            logging: true,
            synchronize: true,
            entities: [ProductEntity],
            migrations: ['../repositories/migrations/*.ts']
        });
        if (connection === undefined) { throw new Error('Error connecting to database'); } // In case the connection failed, the app stops.
        connection.synchronize(); // this updates the database schema to match the models' definitions
        this.connection = connection; // Store the connection object in the class instance.
    }

    // Here we can add all the global middlewares for our application. (Those that will work across every contoller)
    private initializeMiddlewares() {
        this.server.setConfig((app) => {

            app.use(express.json());
        });
    }


    // Boots the application
    public listen() {
        let app = this.server.build();
        app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;