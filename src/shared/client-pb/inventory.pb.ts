import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
} from "class-validator";
import { InventoryAction } from "../enums/inventory.enum"


export class UpdateProductAvailabilityRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  productId: string;
  
  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;
}

export class MoveProductBetweenInventoriesRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  productId: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  fromInventoryId: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  toInventoryId: string;
}

export class CreateInventoryHistoryRequest {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  productId: string;
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  relatedProductId: string;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  previousValue: number;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  newValue: number;
  
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  change: number;
  
  @ApiProperty({ enum: InventoryAction })
  @IsNotEmpty()
  @IsEnum(InventoryAction)
  action: InventoryAction;
  
  
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  notes: string;
}
