import { apiClient } from "./api-client";
import {
  Product,
  ProductResponse,
  ProductQuery,
  CreateProductDto,
  UpdateProductDto,
} from "@/types/catalog";

export interface CreateProductWithImagesParams {
  product: CreateProductDto;
  images?: File[];
}

export const catalogService = {
  async getProducts(query?: ProductQuery): Promise<Product[]> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get<Product[]>(
      `/catalog/products?${params.toString()}`,
    );
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/catalog/products/${id}`);
    return response.data;
  },

  async createProduct(product: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>(
      "/catalog/products",
      product,
    );
    return response.data;
  },

  async createProductWithImages({
    product,
    images,
  }: CreateProductWithImagesParams): Promise<Product> {
    const formData = new FormData();
    
    // Append each field of the product individually (not as JSON string)
    // This way NestJS can parse them properly with ValidationPipe
    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          // For nested objects like specifications, stringify them
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          // For arrays like images and tags, append each item
          // NestJS will parse comma-separated values into arrays
          formData.append(key, (value as any[]).join(','));
        } else {
          formData.append(key, String(value));
        }
      }
    });
    
    // Append images if present
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await apiClient.post<Product>(
      "/catalog/products/with-images",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(
      `/catalog/products/${id}`,
      product,
    );
    return response.data;
  },

  async updateProductWithImages(
    id: string,
    { product, images }: CreateProductWithImagesParams,
  ): Promise<Product> {
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object" && !Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          formData.append(key, (value as any[]).join(","));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const response = await apiClient.put<Product>(
      `/catalog/products/${id}/with-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    const response = await apiClient.delete<Product>(`/catalog/products/${id}`);
    return response.data;
  },

  async searchProducts(query: ProductQuery): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(
      `/catalog/products/search/query`,
      { params: query },
    );
    return response.data;
  },
};
