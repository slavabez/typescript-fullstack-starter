import * as bodyParser from "body-parser";
import * as compression from "compression";
import cookieSession = require("cookie-session");
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as mongoose from "mongoose";
import { Logger } from "winston";
import keys from "./helpers/keys";
import logger from "./helpers/Logger";

class Server {
  public app: express.Application;
  public logger: Logger;

  constructor() {
    this.app = express();
    this.logger = logger;
    this.configure();
    this.connect();
    this.routes();
  }

  public connect() {
    (async () => {
      // Using the useNewUrlParser option cause Mongo complains
      try {
        await mongoose.connect(
          keys.mongoUri,
          { useNewUrlParser: true }
        );
        logger.info("Connected to MongoDB");
      } catch (e) {
        logger.error(
          `Error connecting to MongoDB instance: ${e.code}, ${e.message}`
        );
      }
    })();
  }

  public configure(): void {
    const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
    this.logger.info(`Configuring the server for the ${env} environment...`);
    // Helmet for basic security for Express
    this.app.use(helmet());

    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: false,
        limit: "10mb"
      })
    );

    this.logger.info(
      `The cookie key starts with ${keys.cookieKey.substr(0, 4)}`
    );

    this.app.use(
      cookieSession({
        keys: [keys.cookieKey],
        maxAge: 30 * 24 * 60 * 60 * 1000,
        name: "session"
      })
    );
  }

  public routes(): void {
    this.app.get("/", (req: express.Request, res: express.Response) => {
      res.send({ message: "Pong" });
    });
  }
}

export default Server;
