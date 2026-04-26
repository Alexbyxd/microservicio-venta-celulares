import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ShoppingCart, CartItem } from './interfaces/cart-item.interface';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private readonly TTL = 86400; // 24 horas en segundos

  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  private getCartKey(userId: string): string {
    return `cart:user-${userId}`;
  }

  async getCart(userId: string): Promise<ShoppingCart> {
    const data = await this.redisClient.get(this.getCartKey(userId));
    if (!data) {
      return { userId, items: [], totalAmount: 0, updatedAt: Date.now() };
    }
    
    try {
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Error parseando carrito de usuario ${userId}: ${error.message}. Limpiando datos corruptos.`);
      await this.redisClient.del(this.getCartKey(userId));
      return { userId, items: [], totalAmount: 0, updatedAt: Date.now() };
    }
  }

  async addItem(userId: string, item: CartItem): Promise<ShoppingCart> {
    const cart = await this.getCart(userId);
    const existingItemIndex = cart.items.findIndex((i) => i.productId === item.productId);

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    return this.saveCart(userId, cart);
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<ShoppingCart> {
    const cart = await this.getCart(userId);
    const itemIndex = cart.items.findIndex((i) => i.productId === productId);

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    return this.saveCart(userId, cart);
  }

  async removeItem(userId: string, productId: string): Promise<ShoppingCart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((i) => i.productId !== productId);

    return this.saveCart(userId, cart);
  }

  async clearCart(userId: string): Promise<ShoppingCart> {
    const emptyCart: ShoppingCart = { userId, items: [], totalAmount: 0, updatedAt: Date.now() };
    await this.redisClient.del(this.getCartKey(userId));
    return emptyCart;
  }

  private async saveCart(userId: string, cart: ShoppingCart): Promise<ShoppingCart> {
    // Calcular total
    cart.totalAmount = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cart.updatedAt = Date.now();

    await this.redisClient.set(
      this.getCartKey(userId),
      JSON.stringify(cart),
      'EX',
      this.TTL,
    );

    return cart;
  }
}
