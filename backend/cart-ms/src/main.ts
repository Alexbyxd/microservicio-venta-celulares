import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport, RpcException } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CartMs-Main');
  const rabbitmqHost = process.env.RABBITMQ_HOST || 'amqp://user:pass@localhost:5672';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqHost],
      queue: 'cart_queue',
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new RpcException(errors),
    }),
  );

  await app.listen();
  logger.log('Microservicio de Carrito (Cart-MS) está escuchando en RabbitMQ');
}
bootstrap();
