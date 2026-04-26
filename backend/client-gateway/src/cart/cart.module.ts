import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CartController } from './cart.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { envs } from '../config/envs';

@Module({
  imports: [
    CatalogModule,
    ClientsModule.register([
      {
        name: 'CART_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [envs.rabbitmqHost],
          queue: 'cart_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [CartController],
})
export class CartModule {}
