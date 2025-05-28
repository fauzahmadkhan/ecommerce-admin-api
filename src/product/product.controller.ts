import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors, Version } from '@nestjs/common';
import { ProductService } from "./product.service";
import {
  CreateProductRequest,
  DefaultResponse,
  GetProductByIdRequest,
  PaginationListRequest,
  ProductCatalogueRequest,
} from "../shared/client-pb";
import { Public, Roles } from "../shared/guards";
// import { RoleEnum } from "../shared/enums";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
// import { FilesInterceptor } from "@nestjs/platform-express";
// import { plainToClass } from "class-transformer";


@ApiBearerAuth('JWT-auth')
@ApiTags('Products')
@Controller({ path: 'products', version: '2' })
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }
  
  @Public()
  @Post('catalogue')
  @Version('3')
  catalogue(
    @Body() searchParams: ProductCatalogueRequest,
    @Query() query: PaginationListRequest,
  ): Promise<DefaultResponse> {
    const page = query.page as unknown as number;
    const pageSize = query.pageSize as unknown as number;
    return this.productService.catalogue(searchParams, page, pageSize);
  }
  
  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Public()
  @Post('create')
  create(
    @Body() payload: CreateProductRequest,
  ): Promise<DefaultResponse> {
    return this.productService.create(payload);
  }
  
  @Public()
  @Get('get/:productId')
  getProductById(
    @Param() { productId }: GetProductByIdRequest,
  ): Promise<DefaultResponse> {
    return this.productService.getProductById(productId);
  }
  
  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  // @Public()
  // @Post('update')
  // update(
  //   @Body() payload: UpdateProductRequest,
  // ): Promise<DefaultResponse> {
  //   return this.productService.update(payload);
  // }
  
  // @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  // @Public()
  // @Delete('delete/:productId')
  // deleteById(
  //   @Param() { productId }: GetProductByIdRequest,
  // ): Promise<DefaultResponse> {
  //   return this.productService.deleteById(productId);
  // }
  
  /*
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @Public()
  @Post('update-status')
  bulkUpdateStatus(
    @Body() bulkUpdateStatusParams: BulkUpdateStatusRequest,
  ): Promise<DefaultResponse> {
    return this.productService.bulkUpdateStatus(bulkUpdateStatusParams);
  }
  
  @Public()
  @Post('trending')
  trendingGroups(
    @Body() searchParams: TrendingProductRequest,
    @Query() query: PaginationListRequest,
  ): Promise<DefaultResponse> {
    const page = query.page as unknown as number;
    const pageSize = query.pageSize as unknown as number;
    return this.productService.trendingGroups(searchParams, page, pageSize);
  }
  
  @Public()
  @Post('grouped-search')
  groupedSearch(
    @Body() searchParams: SearchProductGroupsRequest,
    @Query() query: PaginationListRequest,
  ): Promise<DefaultResponse> {
    const page = query.page as unknown as number;
    const pageSize = query.pageSize as unknown as number;
    return this.productService.groupedSearch(searchParams, page, pageSize);
  }
  
  @Public()
  @Post('assign-group')
  assignGroup(
    @Body() assignGroupParams: CreateProductGroupRequest,
  ): Promise<DefaultResponse> {
    return this.productService.assignGroup(assignGroupParams);
  }
  
  @Public()
  @Post('move-to-group')
  moveToGroup(
    @Body() moveToGroupParams: MoveProductsToGroupRequest,
  ): Promise<DefaultResponse> {
    return this.productService.moveToGroup(moveToGroupParams);
  }
  
  @Public()
  @Post('get-group-by-id')
  getProductGroupById(
    @Body() searchParams: GetProductGroupByIdRequest,
  ): Promise<DefaultResponse> {
    return this.productService.getProductGroupById(searchParams);
  }
  
  @Public()
  @Get('automate-groups-creation')
  automateGroupsCreation(): Promise<DefaultResponse> {
    return this.productService.automateGroupsCreation();
  }
  
  @Public()
  @Get('set-groups-featured-images')
  private async setGroupsFeaturedImages(): Promise<any> {
    return this.productService.setGroupsFeaturedImages();
  }
  
  @Public()
  @Get('set-groups-featured-images-for-null-image-groups')
  private async setGroupsFeaturedImagesForNullImageGroups(): Promise<any> {
    return this.productService.setGroupsFeaturedImagesForNullImageGroups();
  }
  
  @Public()
  @Get('set-groups-featured-images-for-null-image-products')
  private async setGroupsFeaturedImagesForNullImageProducts(): Promise<any> {
    return this.productService.setGroupsFeaturedImagesForNullImageProducts();
  }
  
  @Public()
  @Get('get-unique-season-names')
  private async getUniqueSeasonNames(): Promise<any> {
    return this.productService.getUniqueSeasonNames();
  }
  
  @Public()
  @Get('correct-season-names')
  private async correctSeasonNames(): Promise<any> {
    return this.productService.correctSeasonNames();
  }
  */
}
