import { Injectable, Inject, Logger } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { Product, ProductDocument } from './schemas/product.schema';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_MODEL') private productModel: Model<ProductDocument>,
  ) {}

  async findAll(query?: ProductQueryDto) {
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
        if (query.minPrice !== undefined || query.maxPrice !== undefined) {
          filter.price = {};
          if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
          if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
        }
      }

      return await this.productModel.find(filter).lean().exec();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: `Error al obtener productos: ${error.message}`,
      });
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const product = await this.productModel.findById(id).lean().exec();

      if (!product) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }

      return product;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        statusCode: 500,
        message: `Error al obtener producto: ${error.message}`,
      });
    }
  }

  async create(product: CreateProductDto) {
    try {
      const newProduct = new this.productModel(product);
      const saved = await newProduct.save();
      return saved.toObject();
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: `Error al crear producto: ${error.message}`,
      });
    }
  }

  async update(id: string, product: UpdateProductDto) {
    if (!isValidObjectId(id)) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const updated = await this.productModel
        .findByIdAndUpdate(id, product, { new: true })
        .lean()
        .exec();

      if (!updated) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }

      return updated;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        statusCode: 500,
        message: `Error al actualizar producto: ${error.message}`,
      });
    }
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new RpcException({
        statusCode: 400,
        message: 'ID de producto inválido',
      });
    }

    try {
      const deleted = await this.productModel
        .findByIdAndUpdate(id, { isActive: false }, { new: true })
        .lean()
        .exec();

      if (!deleted) {
        throw new RpcException({
          statusCode: 404,
          message: 'Producto no encontrado',
        });
      }

      return deleted;
    } catch (error) {
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        statusCode: 500,
        message: `Error al eliminar producto: ${error.message}`,
      });
    }
  }

  async search(query: ProductQueryDto) {
    try {
      const filter: any = { isActive: true };

      if (query.brand) filter.brand = query.brand;
      if (query.category) filter.category = query.category;
      if (query.color) filter.color = query.color;
      if (query.storage) filter.storage = query.storage;
      if (query.ram) filter.ram = query.ram;
      if (query.condition) filter.condition = query.condition;
      if (query.featured !== undefined) filter.featured = query.featured;

      if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        filter.price = {};
        if (query.minPrice !== undefined) filter.price.$gte = query.minPrice;
        if (query.maxPrice !== undefined) filter.price.$lte = query.maxPrice;
      }

      const limit = query.limit || 20;
      const skip = query.skip || 0;

      const [products, total] = await Promise.all([
        this.productModel.find(filter).skip(skip).limit(limit).lean().exec(),
        this.productModel.countDocuments(filter).exec(),
      ]);

      return { products, total, limit, skip };
    } catch (error) {
      throw new RpcException({
        statusCode: 500,
        message: `Error en búsqueda: ${error.message}`,
      });
    }
  }
}
