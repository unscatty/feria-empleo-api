import  models from "./swagger.models";
import * as dotenv from "dotenv";
import * as swagger from "swagger-express-ts";

dotenv.config();

export const swaggerConfig = {
  definition: {
    consumes: ["application/json",  "multipart/form-data"],
    securityDefinitions: {
      basicAuth: {
        type: swagger.SwaggerDefinitionConstant.Security.Type.BASIC_AUTHENTICATION
      },
      apiKeyHeader: {
        type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
        in: swagger.SwaggerDefinitionConstant.Security.In.HEADER,
        name: "apiHeader"
      },
      Bearer: {
        type: swagger.SwaggerDefinitionConstant.Security.Type.API_KEY,
        name: "Bearer",
        in: swagger.SwaggerDefinitionConstant.Security.In.HEADER
      }
    },
    info: {
      description: "Api feria del empleo",
      title: "API Feria del empleo ESCOM",
      version: "1.0"
    },
    host: process.env.SWAGGER_HOST + ":" + process.env.PORT,
    basePath: "/",
    models: models,
    externalDocs: {
      url: ""
    },
    responses: {
      500: {}
    }
  }
  }
