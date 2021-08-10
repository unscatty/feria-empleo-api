import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';

import { applicationInsigthsConfiguration } from './config/applicationInsights.config';
import { AppModule } from './app.module';
import { CustomLogs } from './library/winston/winston.logs';
import { HttpExceptionFilter } from './error/httpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  applicationInsigthsConfiguration();
  app.enableCors();
  app.use(morgan('tiny'));
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const port = AppModule.port || 3000;
  await app.listen(port, () => {
    CustomLogs.logInfo(`Listening at http://localhost:${port}`);
  });
}
bootstrap();