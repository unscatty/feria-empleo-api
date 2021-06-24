import { InversifyExpressServer } from "inversify-express-utils";
import * as dotenv from "dotenv";
import * as swagger from "swagger-express-ts";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import { container } from "./config/inversify/inversify.config";
import { swaggerConfig } from "./config/swagger/swagger.config";
import { CustomLogs } from "./config/winston/winston.logs";

dotenv.config();

export class Server {

    private app: InversifyExpressServer;

    constructor() {
        this.app = new InversifyExpressServer(container);
        this.configureApp();
    }

    private configureApp(): void {
        this.app.setConfig((server) => {
            server.use(cors({origin: true}));
            server.use(express.json());
            server.use(morgan(process.env.NODE_ENV ? process.env.NODE_ENV : "dev"));
            server.use((process.env.API_DOCS) ? process.env.API_DOCS : "", express.static("swagger"));
            server.use("/api-docs/swagger/assets", express.static("node_modules/swagger-ui-dist"));
            server.use(swagger.express(swaggerConfig));
            server.set("port", process.env.PORT || 3000 );
        });

    }

    public listen(): void {
        const server = this.app.build();
        server.listen(server.get("port"), () => {
            CustomLogs.logInfo(`Server listening on port ${server.get("port")}`);
        });
    }
}
