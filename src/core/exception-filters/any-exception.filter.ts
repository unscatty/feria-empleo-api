import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { CustomLogger } from 'src/library/logger';
import appInsightsErrorMonitoringService from '../monitoring/appInsightsErrorMonitoring.service';

@Catch(Error)
export class AnyExceptionFilter implements ExceptionFilter {
  private logger: CustomLogger = new CustomLogger(AnyExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    const customProperties = {
      statusCode: status,
      path: request.url,
      error: exception.message,
    };

    this.logger.error(exception.message, exception.stack);
    appInsightsErrorMonitoringService.monitorigError(exception, customProperties);

    response.status(status).json({
      statusCode: status,
      path: request.url,
      error: exception.message,
    });
  }
}
