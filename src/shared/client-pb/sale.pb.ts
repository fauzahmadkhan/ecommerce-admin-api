import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDate, IsEmpty, IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator";
import { Type } from "class-transformer";
import { SaleStatusEnum, SaleTimeframeEnum } from "../enums";
import { PlanItems } from "./plan.pb";


export class CreateSaleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  customerId: string;
  
  @ApiProperty({ enum: SaleStatusEnum })
  @IsOptional()
  @IsEnum(SaleStatusEnum)
  status: SaleStatusEnum;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  totalGarments: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  totalPrice: number;
  
  @ApiProperty({ type: Date })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)  // This ensures the transformation to Date
  deliveryDate: Date;
  
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)  // This ensures the transformation to Date
  deliveredOn: Date;
  
  @ApiProperty({
    type: [PlanItems],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanItems)
  items: PlanItems[];
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  couponId: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  discountPrice: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  actualTotalPrice: number;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  receiptUrl: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  shippingCost: number;
  
}

export class GetSaleByIdRequest {
  @IsNotEmpty()
  @IsString()
  saleId: string;
}

export class UpdateSaleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  _id: string;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  customerId: string;
  
  @ApiProperty({ enum: SaleStatusEnum })
  @IsOptional()
  @IsEnum(SaleStatusEnum)
  status: SaleStatusEnum;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  totalGarments: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  totalPrice: number;
  
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)  // This ensures the transformation to Date
  deliveryDate: Date;
  
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)  // This ensures the transformation to Date
  deliveredOn: Date;
  
  @ApiProperty({
    type: [PlanItems],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanItems)
  items: PlanItems[];
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  couponId: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  discountPrice: number;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  actualTotalPrice: number;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  receiptUrl: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  shippingCost: number;
  
}

export class GetSaleByStatusRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  status: string;
}

export class GetSalesAnalyticsRequest {
  @ApiProperty({ enum: SaleTimeframeEnum })
  @IsEnum(SaleTimeframeEnum)
  timeframe: SaleTimeframeEnum;
}

export class GetSalesComparisonRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  period1: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  period2: string;
}
