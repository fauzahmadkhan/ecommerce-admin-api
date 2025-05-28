import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import { CouponRateEnum } from '../../shared/enums';


export type CouponDocument = HydratedDocument<Coupon>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Coupon extends BaseModel {
  @Prop({ required: true, trim: true, })
  title: string;

  @Prop({ required: true })
  price: number;
  
  @Prop({ type: String, enum: CouponRateEnum, default: CouponRateEnum.FLAT })
  rate: CouponRateEnum;
  
  @Prop({ default: true })
  isValid: boolean;
  
  @Prop()
  expiryDate: Date;
  
  @Prop({ default: true })
  isPromotionalCoupon: boolean;
  
}

const CouponSchema = SchemaFactory.createForClass(Coupon);

export { CouponSchema };
