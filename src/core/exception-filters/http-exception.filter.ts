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
    const response = exception.getResponse();

    const status = exception.getStatus();

    const customProperties = {
      statusCode: status,
      path: request.url,
      error: exception.message,
      message: response,
    };

    this.logger.error(JSON.stringify(response, null, 2), exception.stack);
    // (Shallow) Duplicate error object because method modifies original object
    appInsightsErrorMonitoringService.monitorigError(exception, { ...customProperties });

    ctx.getResponse<Response>().status(status).json(customProperties);
  }
}
