import {
  IsArray,
  IsBoolean, IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString, ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationListRequest {
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  page: number;
  
  @ApiProperty({
    type: Number,
  })
  @IsNotEmpty()
  pageSize: number;
}

export interface DefaultResponse {
  statusCode: number;
  data?: Object;
  success: boolean;
  error?: string[];
}

export class GetProductByIdRequest {
  @IsNotEmpty()
  @IsString()
  productId: string;
}

export class CreateProductRequest {
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  barcode: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  description: string;
  
  
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  productImages: string[];
  
  // @ApiProperty({ type: [ProductImageDto] })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ProductImageDto)
  // uploadedImages: ProductImageDto[];
  
}

export class ProductCatalogueRequest {
  
  @ApiProperty({
    type: String,
  })
  @IsString()
  searchTerm: string;
  
}

export class UpdateProductRequest {
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  barcode: string;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  price: number;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  description: string;
  
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  productImages: string[];
  
  // @ApiProperty({ type: [ProductImageDto] })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => ProductImageDto)
  // uploadedImages: ProductImageDto[];
  
}

export class TranslationRequest {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lang: string;
}
