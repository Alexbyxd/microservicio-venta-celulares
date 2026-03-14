import 'dotenv/config';
import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  RABBITMQ_HOST: string;
}

const envsSchema = Joi.object({
  PORT: Joi.number().required(),
  RABBITMQ_HOST: Joi.string().required(),
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
};
