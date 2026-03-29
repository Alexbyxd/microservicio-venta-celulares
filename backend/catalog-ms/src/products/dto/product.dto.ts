import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  IsArray, 
  IsObject,
  Min,
  IsEmail,
  IsMongoId
} from 'class-validator';

export class ProductSpecificationsDto {
  @IsString()
  @IsOptional()
  processor?: string;

  @IsString()
  @IsOptional()
  screenSize?: string;

  @IsString()
  @IsOptional()
  screenResolution?: string;

  @IsString()
  @IsOptional()
  battery?: string;

  @IsString()
  @IsOptional()
  mainCamera?: string;

  @IsString()
  @IsOptional()
  frontCamera?: string;

  @IsString()
  @IsOptional()
  os?: string;

  @IsArray()
  @IsOptional()
  connectivity?: string[];

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsBoolean()
  @IsOptional()
  nfc?: boolean;

  @IsBoolean()
  @IsOptional()
  dualSim?: boolean;

  @IsBoolean()
  @IsOptional()
  fingerprint?: boolean;

  @IsBoolean()
  @IsOptional()
  faceUnlock?: boolean;

  @IsBoolean()
  @IsOptional()
  expandableMemory?: boolean;
}

export class CreateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsObject()
  @IsOptional()
  specifications?: ProductSpecificationsDto;

  @IsString()
  @IsOptional()
  carrierLock?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  subcategory?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsObject()
  @IsOptional()
  specifications?: ProductSpecificationsDto;

  @IsString()
  @IsOptional()
  carrierLock?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsOptional()
  tags?: string[];
}

export class ProductQueryDto {
  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxPrice?: number;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  skip?: number;
}

export class ProductIdDto {
  @IsMongoId()
  id: string;
}
