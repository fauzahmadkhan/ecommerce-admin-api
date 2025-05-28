import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class GetCouponByTitleRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  planId: string;
}

export class GetCouponByIdRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  couponId: string;
}

export class CreateCouponRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  rate: string;
  
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isValid: boolean;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  planId: string;
  
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;
}

export class UpdateCouponRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  id: string;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  title: string;
  
  @ApiProperty({ type: Number })
  @IsOptional()
  @IsNumber()
  price: number;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  rate: string;
  
  @ApiProperty({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isValid: boolean;
  
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  planId: string;
  
  @ApiProperty({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate: Date;
}
