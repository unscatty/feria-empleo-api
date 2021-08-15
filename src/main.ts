import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { applicationInsigthsConfiguration } from './config/applicationInsights.config';
import { HttpExceptionFilter } from './core/exeptions/httpExceptionFilter';
import { CustomLogger } from './library/logger';

async function bootstrap() {
  const logger = new CustomLogger('Main');
  const app = await NestFactory.create(AppModule, {});
  applicationInsigthsConfiguration();
  app.enableCors();
  app.use(morgan('tiny'));
  app.useGlobalFilters(new HttpExceptionFilter());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true,
  //     whitelist: true,
  //   }),
  // );
  const port = AppModule.port || 3000;
  await app.listen(port, () => {
    logger.log(`Listening at http://localhost:${port}`);
  });
}
bootstrap();
