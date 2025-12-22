import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod } from '@nestjs/common';
import { SwaggerConfig, HelmetConfig, validationPipeOptions } from './config';
import { HttpExceptionFilter } from './common/http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(validationPipeOptions);
  app.setGlobalPrefix(AppModule.prefix, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.use(HelmetConfig);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapterHost));

  SwaggerConfig(app);
  await app.listen(AppModule.port);
  return AppModule.port;
}

bootstrap().then((port: number) => {
  Logger.log(`Application running on port: ${port}`, 'Main');
});
