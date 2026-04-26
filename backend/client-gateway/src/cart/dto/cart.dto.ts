import { IsString, IsNumber, Min, IsNotEmpty, IsMongoId } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UserParamDto {
  @IsMongoId({ message: 'UserId debe ser un formato MongoID válido' })
  userId: string;
}
