import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Public, Roles } from "../shared/guards";
import { RoleEnum } from "../shared/enums";
import { CouponService } from "./coupon.service";
import { CreateCouponRequest, GetCouponByIdRequest, GetCouponByTitleRequest } from "../shared/client-pb";


@ApiBearerAuth('JWT-auth')
@ApiTags('Coupon')
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {
  }
  
  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.CUSTOMER)
  @Public()
  @Post('get')
  getCouponByTitle(
    @Body() payload: GetCouponByTitleRequest,
  ): any {
    return this.couponService.getCouponByTitle(payload);
  }
  
  @Public()
  @Get('get-by-id/:couponId')
  getCouponById(
    @Param() payload: GetCouponByIdRequest,
  ): any {
    return this.couponService.getCouponById(payload);
  }
  
  
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Post('create')
  create(
    @Body() payload: CreateCouponRequest,
  ): any {
    return this.couponService.create(payload);
  }
  
}
