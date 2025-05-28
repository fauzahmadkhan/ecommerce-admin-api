import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UpdateProductRequest } from "./product.pb";


export class CartItem {
  @ApiProperty({ type: Object })
  @IsNotEmpty()
  @IsObject()
  product: UpdateProductRequest;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  productId: string;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class UpdateCartRequest {
  
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  totalItems: number;
  
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
  
  @ApiProperty({
    type: [CartItem],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  items: CartItem[];
  
}
