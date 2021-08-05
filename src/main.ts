import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { CustomLogger } from './library/logger';

async function bootstrap() {
  const logger = new CustomLogger('Main'); // Main here is just the context

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.enableCors();
  app.use(morgan('tiny'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const port = AppModule.port || 3000;
  await app.listen(port, () => {
    logger.log('Listening at http://localhost:' + port);
  });
}
bootstrap();
