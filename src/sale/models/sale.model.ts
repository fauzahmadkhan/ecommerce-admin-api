import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import * as mongoose from 'mongoose';
import { Customer } from "../../customer/models/customer.model";
import { PlanItems } from "../../plan/models/plan.model";
import { SaleStatusEnum } from '../../shared/enums';
import { Coupon } from "../../coupon/models/coupon.model";


export type SaleDocument = HydratedDocument<Sale>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Sale extends BaseModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true })
  customerId: Customer;
  
  @Prop({ type: String, enum: SaleStatusEnum, default: SaleStatusEnum.CONFIRMED })
  status: SaleStatusEnum;
  
  @Prop({ default: 0 })
  totalGarments: number;
  
  @Prop({ default: 0 })
  totalPrice: number;
  
  @Prop()
  deliveryDate: Date;
  
  @Prop()
  deliveredOn: Date;
  
  @Prop([PlanItems])
  items: PlanItems[];
  
  @Prop()
  shippingStatus: string;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' })
  couponId: Coupon;
  
  @Prop({ default: 0 })
  discountPrice: number;
  
  @Prop({ default: 0 })
  actualTotalPrice: number;
  
  @Prop({ default: null })
  receiptUrl: string;
  
  @Prop({ default: null })
  pdfUrl: string;
  
  @Prop({ default: 0 })
  shippingCost: number;
  
  // @Prop()
  // bill: object;
  
  // @Prop()
  // shippingAddress: object;
  
}

const SaleSchema = SchemaFactory.createForClass(Sale);

export { SaleSchema };
