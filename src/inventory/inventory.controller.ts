import { Body, Controller, Get, Param, Post, Put, Query, Version } from '@nestjs/common';
import { InventoryService } from "./inventory.service";
import {
  DefaultResponse,
  PaginationListRequest,
  UpdateProductAvailabilityRequest,
  MoveProductBetweenInventoriesRequest,
  CreateInventoryHistoryRequest,
} from "../shared/client-pb";
import { Public, Roles } from "../shared/guards";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";


@ApiBearerAuth('JWT-auth')
@ApiTags('Inventories')
@Controller({ path: 'inventories', version: '2' })
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {
  }
  
  @Public()
  @Get('get-status')
  getInventoryStatus(): Promise<DefaultResponse> {
    return this.inventoryService.getInventoryStatus();
  }
  
  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Public()
  @Put('update-product-availability')
  updateProductAvailability(
    @Body() { productId, available }: UpdateProductAvailabilityRequest,
  ): Promise<DefaultResponse> {
    return this.inventoryService.updateProductAvailability(productId, available);
  }
  
  @Public()
  @Post('move-between-inventories')
  moveProductBetweenInventories(
    @Body() { productId, fromInventoryId, toInventoryId }: MoveProductBetweenInventoriesRequest,
  ): Promise<DefaultResponse> {
    return this.inventoryService.moveProductBetweenInventories(productId, fromInventoryId, toInventoryId);
  }
  
  @Public()
  @Post('create-inventory-history')
  createInventoryHistory(
    @Body() payload: CreateInventoryHistoryRequest,
  ): Promise<DefaultResponse> {
    return this.inventoryService.createInventoryHistory(payload);
  }
  
}
