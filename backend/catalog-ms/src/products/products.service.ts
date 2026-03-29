import { Injectable, Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @Inject('PRODUCT_MODEL') private productModel: Model<ProductDocument>,
  ) {
    this.logger.log('ProductsService inicializado');
  }

  async findAll(query?: ProductQueryDto) {
    this.logger.log('Obteniendo todos los productos');
    
    try {
      const filter: any = { isActive: true };

      if (query) {
        if (query.brand) filter.brand = query.brand;
        if (query.category) filter.category = query.category;
        if (query.color) filter.color = query.color;
        if (query.storage) filter.storage = query.storage;
        if (query.ram) filter.ram = query.ram;
        if (query.condition) filter.condition = query.condition;
        if (query.featured !== undefined) filter.featured = query.featured;
        
        if (query.minPrice || query.maxPrice) {
          filter.price = {};
          if (query.minPrice) filter.price.$gte = query.minPrice;
          if (query.maxPrice) filter.price.$lte = query.maxPrice;
        }
      }

      const products = await this.productModel.find(filter).exec();
      this.logger.log(`Encontrados ${products.length} productos`);
      return products;
    } catch (error) {
      this.logger.error(`Error al obtener productos: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error al obtener productos: ${error.message}`,
      });
    }
  }

  async findOne(id: string) {
    this.logger.log(`Obteniendo producto ${id}`);
    
    if (!id || id.length !== 24) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const product = await this.productModel.findById(id).exec();
      
      if (!product) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }
      
      return product;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error al obtener producto: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error al obtener producto: ${error.message}`,
      });
    }
  }

  async create(product: CreateProductDto) {
    this.logger.log(`Creando producto ${product.name}`);
    
    if (!product.name || !product.brand || !product.model || !product.description || !product.price) {
      throw new RpcException({
        statusCode: 400,
        message: 'Los campos name, brand, model, description y price son requeridos',
      });
    }
    
    try {
      const newProduct = new this.productModel(product);
      const saved = await newProduct.save();
      this.logger.log(`Producto creado con ID: ${saved._id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error al crear producto: ${error.message}`,
      });
    }
  }

  async update(id: string, product: UpdateProductDto) {
    this.logger.log(`Actualizando producto ${id}`);
    
    if (!id || id.length !== 24) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const updated = await this.productModel.findByIdAndUpdate(id, product, { new: true }).exec();
      
      if (!updated) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }
      
      return updated;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error al actualizar producto: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error al actualizar producto: ${error.message}`,
      });
    }
  }

  async delete(id: string) {
    this.logger.log(`Eliminando producto ${id}`);
    
    if (!id || id.length !== 24) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const deleted = await this.productModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
      
      if (!deleted) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }
      
      return deleted;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      this.logger.error(`Error al eliminar producto: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error al eliminar producto: ${error.message}`,
      });
    }
  }

  async search(query: ProductQueryDto) {
    this.logger.log('Buscando productos');
    
    try {
      const filter: any = { isActive: true };

      if (query.brand) filter.brand = query.brand;
      if (query.category) filter.category = query.category;
      if (query.color) filter.color = query.color;
      if (query.storage) filter.storage = query.storage;
      if (query.ram) filter.ram = query.ram;
      if (query.condition) filter.condition = query.condition;
      if (query.featured !== undefined) filter.featured = query.featured;

      if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = query.minPrice;
        if (query.maxPrice) filter.price.$lte = query.maxPrice;
      }

      const limit = query.limit || 20;
      const skip = query.skip || 0;

      const [products, total] = await Promise.all([
        this.productModel.find(filter).skip(skip).limit(limit).exec(),
        this.productModel.countDocuments(filter).exec(),
      ]);

      return { products, total, limit, skip };
    } catch (error) {
      this.logger.error(`Error en búsqueda: ${error.message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Error en búsqueda: ${error.message}`,
      });
    }
  }
}
