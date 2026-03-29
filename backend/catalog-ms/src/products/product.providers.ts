import { Connection } from 'mongoose';
import { Product, ProductSchema } from './schemas/product.schema';

export const productProviders = [
  {
    provide: 'PRODUCT_MODEL',
    useFactory: (connection: Connection) => {
      return connection.model<Product>('Product', ProductSchema);
    },
    inject: ['DATABASE_CONNECTION'],
  },
];
