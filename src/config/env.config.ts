import * as Joi from 'joi';

const EnvVariables = {
  api: {
    prefix: 'API_PREFIX',
    port: 'API_PORT',
    url: 'API_URL',
  },
  database: {
    url: 'DATABASE_URL',
    name: 'POSTGRES_DB',
    user: 'POSTGRES_USER',
    password: 'POSTGRES_PASSWORD',
    host: 'POSTGRES_HOST',
    port: 'POSTGRES_PORT',
  },
  jwt: {
    secret: 'JWT_SECRET',
    accessExpiresIn: 'ACCESS_TOKEN_EXPIRES_IN',
    refreshExpiresIn: 'REFRESH_TOKEN_EXPIRES_IN',
    refreshSecret: 'JWT_REFRESH_SECRET',
    tokenType: 'TOKEN_TYPE',
  },
  google: {
    clientId: 'GOOGLE_CLIENT_ID',
    clientSecret: 'GOOGLE_CLIENT_SECRET',
    callbackUrl: 'GOOGLE_CALLBACK_URL',
  },
  adminCredentials: {
    email: 'ADMIN_EMAIL',
    password: 'ADMIN_PASSWORD',
  },
  client: {
    web: 'WEB_CLIENT',
  },
  smtp: {
    host: 'SMTP_HOST',
    port: 'SMTP_PORT',
    user: 'SMTP_USER',
    password: 'SMTP_PASSWORD',
  },
};

const ValidationSchema: Joi.ObjectSchema<typeof process.env> = Joi.object({
  [EnvVariables.api.prefix]: Joi.string().required(),
  [EnvVariables.api.port]: Joi.number().required(),
  [EnvVariables.api.url]: Joi.string().required(),

  [EnvVariables.database.url]: Joi.string().required(),
  [EnvVariables.database.name]: Joi.string().required(),
  [EnvVariables.database.user]: Joi.string().required(),
  [EnvVariables.database.password]: Joi.string().required(),
  [EnvVariables.database.host]: Joi.string().required(),
  [EnvVariables.database.port]: Joi.number().required(),

  [EnvVariables.jwt.secret]: Joi.string().required(),
  [EnvVariables.jwt.accessExpiresIn]: Joi.string().required(),
  [EnvVariables.jwt.refreshExpiresIn]: Joi.string().required(),
  [EnvVariables.jwt.refreshSecret]: Joi.string().required(),
  [EnvVariables.jwt.tokenType]: Joi.string().required(),

  [EnvVariables.adminCredentials.email]: Joi.string().email().required(),
  [EnvVariables.adminCredentials.password]: Joi.string().required(),

  [EnvVariables.google.clientId]: Joi.string().required(),
  [EnvVariables.google.clientSecret]: Joi.string().required(),
  [EnvVariables.google.callbackUrl]: Joi.string().required(),

  [EnvVariables.client.web]: Joi.string().required(),

  [EnvVariables.smtp.host]: Joi.string().required(),
  [EnvVariables.smtp.port]: Joi.number().required(),
  [EnvVariables.smtp.user]: Joi.string().required(),
  [EnvVariables.smtp.password]: Joi.string().required(),
});

export { ValidationSchema, EnvVariables };
