import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { isUndefined } from 'lodash';
import { Request, Response } from 'express';

import { CustomLogger } from 'src/library/logger';
import { ServerException } from './exceptions';
import appInsightsErrorMonitoringService from './monitoring/appInsightsErrorMonitoring.service';

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
    private logger: CustomLogger = new CustomLogger(HttpExceptionFilter.name);

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const status = isUndefined(exception.status) ? new ServerException(exception).getStatus() : exception.getStatus();
        const customProperties = {
            statusCode: status,
            path: request.url,
            error: exception.message
        };

        this.logger.error(exception, JSON.stringify(exception));
        appInsightsErrorMonitoringService.monitorigError(exception, customProperties);

        ctx.getResponse<Response>()
        .status(status)
        .send({
            statusCode: status,
            path: request.url,
            error: exception.message
        });
    }
}