import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { applicationInsigthsConfiguration } from './config/applicationInsights.config';
import { AnyExceptionFilter } from './core/exceptions-filters/any-exception.filter';
import { HttpExceptionFilter } from './core/exceptions-filters/http-exception.filter';
import { CustomLogger } from './library/logger';

async function bootstrap() {
  const logger = new CustomLogger('Main');
  const app = await NestFactory.create(AppModule, {});
  applicationInsigthsConfiguration();
  app.enableCors();
  app.use(morgan('tiny'));
  app.useGlobalFilters(new AnyExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), { strategy: 'exposeAll' })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  const port = AppModule.port || 3000;
  await app.listen(port, () => {
    logger.log(`Listening at http://localhost:${port}`);
  });
}
bootstrap();
