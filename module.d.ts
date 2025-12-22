declare namespace NodeJS {
  export interface ProcessEnv {
    API_PORT: number;
    API_PREFIX: string;
    API_URL: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    DATABASE_URL: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    JWT_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    TOKEN_TYPE: string;
    ADMIN_EMAIL: string;
    ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALLBACK_URL: string;
    WEB_CLIENT: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
  }
}
