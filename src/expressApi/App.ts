import express from 'express';
import { createConnection, Connection } from 'typeorm';
import {InversifyExpressServer} from "inversify-express-utils";
import {Container} from "inversify";
import {OrderEntity, ProductEntity} from "../repositories/mappers";
import {containerConfigurator} from "../inversify.config";

class App {
    public server: InversifyExpressServer;
    public port: number;
    public connection: Connection | undefined; // TypeORM connection to the database

    // The constructor receives an array with instances of the controllers for the application and an integer to designate the port number.
    constructor(port: number) {
        let container = new Container();
        container = containerConfigurator(container);
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
            entities: [ProductEntity, OrderEntity],
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