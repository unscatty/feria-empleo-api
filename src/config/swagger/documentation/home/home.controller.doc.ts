import { SwaggerDefinitionConstant } from "swagger-express-ts";

export const swaggerHomeController = {
    apiPath: {
        name: "Home",
        path: "/"
    },
    index: {
        description: "Ruta principal",
        summary: "Ruta principal para validar si el sistema esta operando",
        responses: {
            200: {
                description: "¡API WORKS!",
                type: SwaggerDefinitionConstant.JSON
            }
        }
    }
}