import express, { Application } from 'express'
import mongoose from 'mongoose'

import routes from './routes'

const { NODE_ENV } = process.env;

class App {
    server: Application

    constructor() {
        this.server = express();
        
        this.middlewares();
        NODE_ENV !== "test" && this.database();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    database() {
        mongoose.connect("mongodb://localhost/todo-list", {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    routes() {
        this.server.use('/api', routes);
    }
}

const myApp = new App();
export default myApp.server;