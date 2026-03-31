export interface ProductSpecifications {
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
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
  price: number;
  currency?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  subcategory?: string;
  color?: string;
  storage?: string;
  ram?: string;
  condition?: string;
  images?: string[];
  specifications?: ProductSpecifications;
  carrierLock?: string;
  isActive?: boolean;
  featured?: boolean;
  stock?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQuery {
  brand?: string;
  category?: string;
  color?: string;
  storage?: string;
  ram?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  limit?: number;
  skip?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  limit: number;
  skip: number;
}

export interface CreateProductDto {
  name?: string;
  brand?: string;
  model?: string;
  description?: string;
  price?: number;
  currency?: string;
  sku?: string;
  barcode?: string;
  category?: string;
  subcategory?: string;
  color?: string;
  storage?: string;
  ram?: string;
  condition?: string;
  images?: string[];
  specifications?: ProductSpecifications;
  carrierLock?: string;
  featured?: boolean;
  stock?: number;
  tags?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  isActive?: boolean;
}