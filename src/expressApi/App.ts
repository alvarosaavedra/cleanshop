import express from 'express';
import { createConnection, Connection } from 'typeorm';
import {InversifyExpressServer} from "inversify-express-utils";
import {Container} from "inversify";

class App {
    public server: InversifyExpressServer;
    public port: number;
    public connection: Connection | undefined; // TypeORM connection to the database

    // The constructor receives an array with instances of the controllers for the application and an integer to designate the port number.
    constructor(port: number, configurators: {(container: Container): Container}[], createModels: boolean = true) {
        let container = new Container();
        for (let configuration of configurators) {
            container = configuration(container);
        }
        this.server = new InversifyExpressServer(container);
        this.port = port;
        if(createModels){this.initializeModels();}
        this.initializeMiddlewares();
    }

    private async initializeModels() {
        const connection = await createConnection();
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

    public  address(){
        return this.port
    }
}

export default App;