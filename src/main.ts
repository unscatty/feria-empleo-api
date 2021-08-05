import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { CustomLogs } from './library/winston/winston.logs';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {});

  app.enableCors();
  app.use(morgan('tiny'));

  app.useGlobalPipes(new ValidationPipe());
  const port = AppModule.port || 3000;
  await app.listen(port, () => {
    CustomLogs.logInfo(`Listening at http://localhost:${port}`);
  });
}
bootstrap();
