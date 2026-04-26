import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { CartService } from './cart.service';
import { AddItemDto, UpdateItemQuantityDto } from './dto/cart-item.dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern('cart.get')
  async getCart(@Payload() data: { userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.cartService.getCart(data.userId);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      // En microservicios, si falla algo crítico podríamos hacer nack,
      // pero usualmente devolvemos el error al gateway y hacemos ack para quitarlo de la cola
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('cart.add')
  async addItem(@Payload() data: AddItemDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.cartService.addItem(data.userId, data.item);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('cart.update')
  async updateQuantity(@Payload() data: UpdateItemQuantityDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.cartService.updateItemQuantity(data.userId, data.productId, data.quantity);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('cart.remove')
  async removeItem(@Payload() data: { userId: string; productId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.cartService.removeItem(data.userId, data.productId);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }

  @MessagePattern('cart.clear')
  async clearCart(@Payload() data: { userId: string }, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      const result = await this.cartService.clearCart(data.userId);
      channel.ack(originalMsg);
      return result;
    } catch (error) {
      channel.ack(originalMsg);
      throw error;
    }
  }
}
