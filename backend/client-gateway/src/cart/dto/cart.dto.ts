import { IsString, IsNumber, Min, IsNotEmpty, IsMongoId } from 'class-validator';

export class AddToCartDto {
  @IsMongoId({ message: 'ProductId debe ser un formato MongoID válido' })
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsMongoId({ message: 'ProductId debe ser un formato MongoID válido' })
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UserParamDto {
  @IsMongoId({ message: 'UserId debe ser un formato MongoID válido' })
  userId: string;
}

export class RemoveCartItemParamDto extends UserParamDto {
  @IsMongoId({ message: 'ProductId debe ser un formato MongoID válido' })
  productId: string;
}
