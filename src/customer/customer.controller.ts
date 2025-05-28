import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CustomerService } from "./customer.service";
import {
  DefaultResponse,
  PaginationListRequest, TranslationRequest, UpdateCartRequest,
} from "../shared/client-pb";
import { Public, Roles } from "../shared/guards";
// import { RoleEnum } from "../shared/enums";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
// import { I18n, I18nContext } from "nestjs-i18n";


@ApiBearerAuth('JWT-auth')
@ApiTags('Customers')
@Controller({ path: "customers", version: "1" })
export class CustomerController {
  constructor(private readonly productService: CustomerService) {
  }
  
  @Public()
  @Post('cart')
  updateCart(
    @Body() cartData: UpdateCartRequest,
  ): Promise<DefaultResponse> {
    return this.productService.updateCart(cartData);
  }
  
  @Public()
  @Get('greet')
  greetCustomer(
    @Query() query: TranslationRequest,
  ): any {
    const lang = query.lang as unknown as string;
    return this.productService.greetCustomer(lang);
  }
  
  // @Get('hello')
  // hello(@I18n() i18n: I18nContext) {
  //   return i18n.translate('common.HELLO');
  // }
  
  
  
}
