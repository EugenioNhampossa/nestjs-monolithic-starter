import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const title = 'Base API';
const description = 'This is the documentation of base api.';
const tokenName = 'access-token';
const authOptions: SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'Bearer',
};

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const SwaggerConfig = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth(authOptions, tokenName)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`/docs`, app, document);
};
