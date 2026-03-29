import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/catalog.dto';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter';

@Controller('catalog')
@UseFilters(RpcExceptionFilter)
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAllProducts(@Query() query: ProductQueryDto) {
    return await this.catalogService.findAllProducts(query);
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return await this.catalogService.findProductById(id);
  }

  @Post('products')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createProduct(@Body() product: CreateProductDto) {
    return await this.catalogService.createProduct(product);
  }

  @Put('products/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return await this.catalogService.updateProduct(id, product);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.catalogService.deleteProduct(id);
  }

  @Get('products/search/query')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchProducts(@Query() query: ProductQueryDto) {
    return await this.catalogService.searchProducts(query);
  }
}
