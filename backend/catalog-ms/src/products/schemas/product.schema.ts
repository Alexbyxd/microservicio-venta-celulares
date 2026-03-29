import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  currency: string;

  @Prop()
  sku: string;

  @Prop()
  barcode: string;

  @Prop()
  category: string;

  @Prop()
  subcategory: string;

  @Prop()
  color: string;

  @Prop()
  storage: string;

  @Prop()
  ram: string;

  @Prop()
  condition: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object })
  specifications: {
    processor?: string;
    screenSize?: string;
    screenResolution?: string;
    battery?: string;
    mainCamera?: string;
    frontCamera?: string;
    os?: string;
    connectivity?: string[];
    dimensions?: string;
    weight?: string;
    nfc?: boolean;
    dualSim?: boolean;
    fingerprint?: boolean;
    faceUnlock?: boolean;
    expandableMemory?: boolean;
  };

  @Prop()
  carrierLock: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  featured: boolean;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 0 })
  soldCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
