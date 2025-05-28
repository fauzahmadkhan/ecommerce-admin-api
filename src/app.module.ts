import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { CustomerSchema } from "./customer/models/customer.model";
import { CartSchema } from "./customer/models/cart.model";
import { ProductSchema } from "./product/models/product.model";
import { InventorySchema } from "./inventory/models/inventory.model";
import { InventoryHistorySchema } from "./inventory/models/inventory-history.model";
import { ProductController } from "./product/product.controller";
import { ProductService } from "./product/product.service";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./shared/guards";
import { CustomerController } from "./customer/customer.controller";
import { CustomerService } from "./customer/customer.service";
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { PlanSchema } from "./plan/models/plan.model";
import { SaleSchema } from "./sale/models/sale.model";
import { AddressSchema } from "./customer/models/address.model";
import { CreditCardSchema } from "./customer/models/credit-card.model";
import { FavoriteSchema } from "./customer/models/favorite.model";
import { CouponSchema } from "./coupon/models/coupon.model";
import { PlanController } from "./plan/plan.controller";
import { PlanService } from "./plan/plan.service";
import { SaleController } from "./sale/sale.controller";
import { SaleService } from "./sale/sale.service";
import { CouponController } from "./coupon/coupon.controller";
import { CouponService } from "./coupon/coupon.service";
import { SeedService } from "./seed/seed.service";
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.DATA_BASE}`),
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Inventory', schema: InventorySchema },
      { name: 'InventoryHistory', schema: InventoryHistorySchema },
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Cart', schema: CartSchema },
      { name: 'Sale', schema: SaleSchema },
      { name: 'Address', schema: AddressSchema },
      { name: 'CreditCard', schema: CreditCardSchema },
      { name: 'Favorite', schema: FavoriteSchema },
      { name: 'Plan', schema: PlanSchema },
      { name: 'Coupon', schema: CouponSchema },
      // { name: 'SystemUser', schema: SystemUserSchema },
    ]),
    // JwtModule.register({
    //   secret: `${process.env.JWT_TOKEN_SECRET}`,
    // }),
    // ScheduleModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/../i18n/'), // Adjusted path
        watch: true, // Keep hot reload
      },
      resolvers: [
        new AcceptLanguageResolver(),
        new QueryResolver(['lang']),
      ],
      typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
    }),
    CacheModule.register({
      ttl: 60, // seconds (default time-to-live)
      max: 100, // maximum number of items in cache
    }),
  ],
  controllers: [
    AppController,
    ProductController,
    CustomerController,
    CustomerController,
    ProductController,
    PlanController,
    // SystemUserController,
    SaleController,
    // PaymentController,
    CouponController,
    // TransactionController,
  ],
  providers: [
    AppService,
    ProductService,
    // JwtService,
    // JwtStrategy,
    CustomerService,
    ProductService,
    PlanService,
    SaleService,
    // HelpersService,
    // CronService,
    // PaymentService,
    CouponService,
    // TransactionService,
    CustomerService,
    SeedService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}
