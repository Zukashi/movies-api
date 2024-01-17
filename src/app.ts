import express, { Application } from 'express';
// import compression from 'compression';
import { useExpressServer, useContainer } from 'routing-controllers';
import cors from 'cors';
import { Server } from 'http';
import { controllers } from '@controllers/index';
import { Container } from 'typedi';
import ErrorHandler from '@middlewares/error-handler.middleware';
import { logger } from '@common/logger';
import { pinoHttp } from 'pino-http';
export class App {
    private readonly app: Application;
    private readonly port: Number;
    private server: Server;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT);
        this.startMiddlewares();
        this.startDIContainer();
        this.startControllers();
    }

    public start(): void {
        this.server = this.app.listen(this.port);
        console.log(`Running at localhost:${this.port}.`);
    }

    public getServer(): Server {
        return this.server;
    }

    private startMiddlewares(): void {
        this.app.use(cors({ methods: ['GET', 'POST'], origin: '*' }));
        this.app.use(pinoHttp({ logger }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.set('etag', false);
        // this.app.use(compression()); Compression seems to not resolve due to package mismatch
    }

    private startDIContainer(): void {
        useContainer(Container);
    }

    private startControllers(): void {
        useExpressServer(this.app, {
            validation: false,
            defaultErrorHandler: false,
            controllers: controllers,
            middlewares: [ErrorHandler]
        });
    }
}
