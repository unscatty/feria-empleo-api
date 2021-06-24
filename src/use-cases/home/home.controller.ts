import { ApiOperationGet, ApiPath } from "swagger-express-ts";
import { BaseHttpController, controller, httpGet } from "inversify-express-utils";
import { Request, Response } from "express";

import { ResponseAPI } from "../../utils/api.response";
import { swaggerHomeController } from "../../config/swagger/documentation/home/home.controller.doc";

@ApiPath(swaggerHomeController.apiPath)
@controller("/")
export class HomeController extends BaseHttpController {

    constructor() {
        super();
    }

    @ApiOperationGet(swaggerHomeController.index)
    @httpGet("/")
    public index(request: Request, response: Response): void {
        const responseApi: ResponseAPI = new ResponseAPI();
        return responseApi.send("¡API WORKS!", response);
    }
}