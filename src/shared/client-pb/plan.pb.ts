import {
  IsArray,
  IsBoolean, IsEnum,
  IsNotEmpty, IsNumber, IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PlanDurationEnum, PlanTypeEnum } from "../enums";
import { UpdateProductRequest } from "./product.pb";

export class PlanItems {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  productId: string;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  
  // @ApiProperty({ type: String })
  // @IsOptional()
  // @IsString()
  // categoryId: string;
  
  @ApiProperty({ type: Object })
  @IsOptional()
  @IsObject()
  product: UpdateProductRequest;
}

export class CreatePlanRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @ApiProperty({ enum: PlanTypeEnum })
  @IsNotEmpty()
  @IsEnum(PlanTypeEnum)
  type: PlanTypeEnum;
  
  @ApiProperty({ enum: PlanDurationEnum })
  @IsNotEmpty()
  @IsEnum(PlanDurationEnum)
  duration: PlanDurationEnum;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  maxLimit: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  price: number;
  
  @ApiProperty({
    type: [PlanItems],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanItems)
  items: PlanItems[];
  
  @ApiProperty({ type: [String] })
  @IsArray()
  freeStyleDescriptionItems: string[];
}

export class GetPlanByIdRequest {
  @IsNotEmpty()
  @IsString()
  planId: string;
}

export class UpdatePlanRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  title: string;
  
  @ApiProperty({ enum: PlanDurationEnum })
  @IsOptional()
  @IsEnum(PlanDurationEnum)
  duration: PlanDurationEnum;
  
  @ApiProperty({ enum: PlanTypeEnum })
  @IsOptional()
  @IsEnum(PlanTypeEnum)
  type: PlanTypeEnum;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  maxLimit: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  price: number;
  
  @ApiProperty({
    type: [PlanItems],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanItems)
  items: PlanItems[];
  
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  freeStyleDescriptionItems: string[];
}
