export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShoppingCart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  updatedAt: number;
}
