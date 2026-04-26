import { IsString, IsNumber, IsInt, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  item: CartItemDto;
}

export class UpdateItemQuantityDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
