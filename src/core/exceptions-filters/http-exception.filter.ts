import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from 'src/library/logger';
import appInsightsErrorMonitoringService from '../monitoring/appInsightsErrorMonitoring.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: CustomLogger = new CustomLogger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const customProperties = {
      statusCode: status,
      path: request.url,
      error: exception.message,
    };

    this.logger.error(exception.message, exception.stack);
    appInsightsErrorMonitoringService.monitorigError(exception, customProperties);

    ctx.getResponse<Response>().status(status).send(customProperties);
  }
}
