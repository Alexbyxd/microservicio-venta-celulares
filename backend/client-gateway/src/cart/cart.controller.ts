import { Controller, Get, Post, Patch, Delete, Param, Body, Inject, NotFoundException, InternalServerErrorException, BadRequestException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CatalogService } from '../catalog/catalog.service';
import { AddToCartDto, UpdateCartItemDto, UserParamDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    @Inject('CART_SERVICE') private readonly cartClient: ClientProxy,
    private readonly catalogService: CatalogService,
  ) {}

  @Get(':userId')
  async getCart(@Param() params: UserParamDto) {
    const { userId } = params;
    try {
      return await firstValueFrom(this.cartClient.send('cart.get', { userId }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  @Post(':userId/add')
  async addItem(
    @Param() params: UserParamDto,
    @Body() body: AddToCartDto,
  ) {
    const { userId } = params;
    // 1. Validar que el producto existe en el catálogo
    const product = await this.catalogService.findProductById(body.productId);
    if (!product) {
      throw new NotFoundException(`Producto con ID ${body.productId} no encontrado`);
    }

    // 2. Preparar el item con datos del catálogo (snapshot)
    const cartItem = {
      productId: product._id || product.id,
      name: product.name,
      price: product.price,
      quantity: body.quantity,
      imageUrl: product.images && product.images.length > 0 ? product.images[0] : undefined,
    };

    // 3. Mandar al microservicio de carrito
    try {
      return await firstValueFrom(this.cartClient.send('cart.add', { userId, item: cartItem }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  @Patch(':userId/update')
  async updateQuantity(
    @Param() params: UserParamDto,
    @Body() body: UpdateCartItemDto,
  ) {
    const { userId } = params;
    try {
      return await firstValueFrom(
        this.cartClient.send('cart.update', {
          userId,
          productId: body.productId,
          quantity: body.quantity,
        }),
      );
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  @Delete(':userId/remove/:productId')
  async removeItem(
    @Param() params: UserParamDto,
    @Param('productId') productId: string,
  ) {
    const { userId } = params;
    try {
      return await firstValueFrom(this.cartClient.send('cart.remove', { userId, productId }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  @Delete(':userId/clear')
  async clearCart(@Param() params: UserParamDto) {
    const { userId } = params;
    try {
      return await firstValueFrom(this.cartClient.send('cart.clear', { userId }));
    } catch (error) {
      this.handleRpcError(error);
    }
  }

  private handleRpcError(error: any) {
    const message = error.message || 'Error en la comunicación con el microservicio';
    const statusCode = error.statusCode || error.status;

    // Si el error ya es una instancia de RpcException, intentamos extraer el error interno
    const errorData = error instanceof RpcException ? error.getError() : error;
    
    // Mapeo semántico de errores
    if (statusCode === 404 || message.toLowerCase().includes('not found')) {
      throw new NotFoundException(message);
    }
    if (statusCode === 401 || message.toLowerCase().includes('unauthorized')) {
      throw new UnauthorizedException(message);
    }
    if (statusCode === 409 || message.toLowerCase().includes('conflict')) {
      throw new ConflictException(message);
    }
    if (statusCode === 400 || message.toLowerCase().includes('bad request') || message.toLowerCase().includes('invalid')) {
      throw new BadRequestException(message);
    }

    // Fallback por defecto
    throw new InternalServerErrorException(message);
  }
}
