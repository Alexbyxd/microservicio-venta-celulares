import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto, ProductIdDto } from './dto/product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('getAllProducts')
  findAll(@Payload() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @MessagePattern('getProductById')
  findOne(@Payload() id: string) {
    return this.productsService.findOne(id);
  }

  @MessagePattern('createProduct')
  create(@Payload() product: CreateProductDto) {
    return this.productsService.create(product);
  }

  @MessagePattern('updateProduct')
  update(@Payload() data: { id: string; product: UpdateProductDto }) {
    return this.productsService.update(data.id, data.product);
  }

  @MessagePattern('deleteProduct')
  delete(@Payload() id: string) {
    return this.productsService.delete(id);
  }

  @MessagePattern('searchProducts')
  search(@Payload() query: ProductQueryDto) {
    return this.productsService.search(query);
  }
}
