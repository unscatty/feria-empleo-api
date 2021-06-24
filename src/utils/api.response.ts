import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ResponseAPI {

    public send<T>(data: T, response: Response): void {
        response.json(data);
    }

    public sendError(response: Response, error: Error): void {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
    }

}