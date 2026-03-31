import { apiClient } from "./api-client";
import { Product, ProductResponse, ProductQuery, CreateProductDto, UpdateProductDto } from "@/types/catalog";

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
    const response = await apiClient.get<Product[]>(`/api/catalog/products?${params.toString()}`);
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/catalog/products/${id}`);
    return response.data;
  },

  async createProduct(product: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>("/api/catalog/products", product);
    return response.data;
  },

  async updateProduct(id: string, product: UpdateProductDto): Promise<Product> {
    const response = await apiClient.put<Product>(`/api/catalog/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string): Promise<Product> {
    const response = await apiClient.delete<Product>(`/api/catalog/products/${id}`);
    return response.data;
  },

  async searchProducts(query: ProductQuery): Promise<ProductResponse> {
    const response = await apiClient.get<ProductResponse>(`/api/catalog/products/search/query`, { params: query });
    return response.data;
  },
};
