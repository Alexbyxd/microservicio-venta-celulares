import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [AuthModule, CatalogModule, CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
