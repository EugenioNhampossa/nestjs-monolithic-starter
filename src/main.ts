import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerConfig, HelmetConfig, validationPipeOptions } from './config';
import { HttpExceptionFilter } from './common/http';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: AppModule.webclient,
    credentials: true,
  });

  app.setGlobalPrefix(AppModule.prefix);
  app.useGlobalPipes(validationPipeOptions);
  app.use(HelmetConfig);
  app.use(cookieParser());

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  SwaggerConfig(app);
  await app.listen(AppModule.port);
  return AppModule.port;
}

bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
