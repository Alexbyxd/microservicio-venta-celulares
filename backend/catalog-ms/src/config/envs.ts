import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_HOST: string;
  DATABASE_URL: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  RABBITMQ_HOST: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().optional().default(''),
  CLOUDINARY_API_KEY: Joi.string().optional().default(''),
  CLOUDINARY_API_SECRET: Joi.string().optional().default(''),
})
  .unknown()
  .required();

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error('Error en las variables de entorno: ' + error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  rabbitmqHost: envVars.RABBITMQ_HOST,
  databaseUrl: envVars.DATABASE_URL,
  cloudinary: {
    cloudName: envVars.CLOUDINARY_CLOUD_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    apiSecret: envVars.CLOUDINARY_API_SECRET,
  },
};
