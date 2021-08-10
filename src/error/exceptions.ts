import { HttpException, HttpStatus } from "@nestjs/common";

export class ServerException extends HttpException {
    constructor(error: Error) {
        super(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class BadRequestException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }
}
