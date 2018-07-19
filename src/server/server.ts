import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import * as winston from "winston";

class Server {
    public app: express.Application;

    constructor(){
        this.app = express();
        this.configure();
        this.routes();
    }

    public configure(): void {
        
    }
}