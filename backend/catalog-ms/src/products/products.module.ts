import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/db.module';
import { productProviders } from './product.providers';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [...productProviders, ProductsService],
})
export class ProductsModule {}
