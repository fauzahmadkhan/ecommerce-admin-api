import { Body, Controller, Delete, Get, Param, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SaleService } from "./sale.service";
import { Public, Roles } from "../shared/guards";
import { RoleEnum } from "../shared/enums";
import {
  CreateSaleRequest,
  DefaultResponse,
  GetSaleByIdRequest,
  GetSaleByStatusRequest,
  GetSalesAnalyticsRequest,
  GetSalesComparisonRequest,
} from "../shared/client-pb";


@ApiBearerAuth('JWT-auth')
@ApiTags('Sale')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {
  }
  
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Post('place')
  placeSale(
    @Body() payload: CreateSaleRequest,
  ): Promise<DefaultResponse> {
    return this.saleService.placeSale(payload);
  }
  
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Get('list-customer-sales')
  listCustomerSales(
    @Request() request: any,
  ): Promise<DefaultResponse> {
    return this.saleService.listCustomerSales(request?.user?.userId as string || null);
  }
  
  @Public()
  @Get('get/:saleId')
  getSaleById(
    @Param() { saleId }: GetSaleByIdRequest,
  ): Promise<DefaultResponse> {
    return this.saleService.getSaleById(saleId);
  }
  
  @Public()
  @Get('get-sales-by-status')
  getSalesByStatus(
    @Param() { status }: GetSaleByStatusRequest,
  ): Promise<DefaultResponse> {
    return this.saleService.getSalesByStatus(status);
  }
  
  @Public()
  @Post('get-sales-analytics')
  getSalesAnalytics(
    @Body() { timeframe }: GetSalesAnalyticsRequest,
  ): Promise<DefaultResponse> {
    return this.saleService.getSalesAnalytics(timeframe);
  }
  
  @Public()
  @Post('get-sales-comparison')
  getSalesComparison(
    @Body() { period1, period2 }: GetSalesComparisonRequest,
  ): Promise<DefaultResponse> {
    return this.saleService.getSalesComparison(period1, period2);
  }
  
  @Public()
  @Get('get-sales-by-product')
  getSalesByProduct(): Promise<DefaultResponse> {
    return this.saleService.getSalesByProduct();
  }
  
  
}
