import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import mongoose from "mongoose";
import { ProductDocument } from "../../product/models/product.model";
// import { CustomerDocument } from "./customer.model";
// import { CartItems } from "../../plan/models/plan.model";
// import { SubscriptionDocument } from "../../subscription/models/subscription.model";

export class CartItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: ProductDocument;
  
  @Prop()
  quantity: number;
}

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Cart extends BaseModel {
  
  @Prop({ default: 1 })
  customerId: number;
  
  @Prop([CartItems])
  items: CartItems[];
 
  @Prop({ default: 0 })
  totalItems: number;
  
  @Prop({ default: 0 })
  totalPrice: number;
  
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  // customerId: CustomerDocument;
  
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' })
  // subscriptionId: SubscriptionDocument;
  
  // @Prop([CartItems])
  // extraItems: CartItems[];
  //
  // @Prop({ default: 0 })
  // planItemsTotalGarments: number;
  //
  // @Prop({ default: 0 })
  // planItemsTotalPrice: number;
  //
  // @Prop({ default: 0 })
  // extraItemsTotalGarments: number;
  //
  // @Prop({ default: 0 })
  // extraItemsTotalPrice: number;
  
  
}

const CartSchema = SchemaFactory.createForClass(Cart);
export { CartSchema };
