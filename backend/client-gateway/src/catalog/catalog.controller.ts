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
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CatalogService } from './catalog.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/catalog.dto';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../config/cloudinary.service';

@Controller('catalog')
@UseFilters(RpcExceptionFilter)
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(
    private readonly catalogService: CatalogService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  @Post('products/with-images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new HttpException('Tipo de archivo no permitido', HttpStatus.BAD_REQUEST), false);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
      },
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProductWithImages(
    @Body() productData: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    if (files?.images && files.images.length > 0) {
      const uploadedUrls = await this.cloudinaryService.uploadFiles(files.images);
      productData.images = [...(productData.images || []), ...uploadedUrls];
    }

    if (productData.images && productData.images.length > 0) {
      productData.images = await this.cloudinaryService.processImages(productData.images);
    }

    return await this.catalogService.createProduct(productData);
  }

  @Put('products/:id/with-images')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 },
      ],
      {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
          const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new HttpException('Tipo de archivo no permitido', HttpStatus.BAD_REQUEST), false);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB
        },
      },
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProductWithImages(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    if (files?.images && files.images.length > 0) {
      const uploadedUrls = await this.cloudinaryService.uploadFiles(files.images);
      productData.images = [...(productData.images || []), ...uploadedUrls];
    }

    if (productData.images && productData.images.length > 0) {
      productData.images = await this.cloudinaryService.processImages(productData.images);
    }

    return await this.catalogService.updateProduct(id, productData);
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
