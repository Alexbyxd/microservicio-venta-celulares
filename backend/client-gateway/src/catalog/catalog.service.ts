import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout, catchError, throwError } from 'rxjs';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    @Inject('CATALOG_SERVICE') private readonly catalogClient: ClientProxy,
  ) {}

  async findAllProducts(query?: ProductQueryDto) {
    this.logger.log('Enviando solicitud a catalog-ms: getAllProducts');
    
    return firstValueFrom(
      this.catalogClient.send('getAllProducts', query || {}).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en getAllProducts: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }

  async findProductById(id: string) {
    this.logger.log(`Enviando solicitud a catalog-ms: getProductById ${id}`);
    
    return firstValueFrom(
      this.catalogClient.send('getProductById', id).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en getProductById: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }

  async createProduct(product: CreateProductDto) {
    this.logger.log('Enviando solicitud a catalog-ms: createProduct');
    return firstValueFrom(
      this.catalogClient.send('createProduct', product).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en createProduct: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }

  async updateProduct(id: string, product: UpdateProductDto) {
    return firstValueFrom(
      this.catalogClient.send('updateProduct', { id, product }).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en updateProduct: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }

  async deleteProduct(id: string) {
    return firstValueFrom(
      this.catalogClient.send('deleteProduct', id).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en deleteProduct: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }

  async searchProducts(query: ProductQueryDto) {
    return firstValueFrom(
      this.catalogClient.send('searchProducts', query).pipe(
        timeout(10000),
        catchError((err) => {
          this.logger.error(`Error en searchProducts: ${err.message}`);
          return throwError(() => new Error('Microservicio no disponible o timeout'));
        }),
      ),
    );
  }
}
