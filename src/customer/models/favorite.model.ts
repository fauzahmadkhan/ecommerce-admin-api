import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import mongoose from "mongoose";
import { CustomerDocument } from "./customer.model";
import { InventoryDocument } from "../../inventory/models/inventory.model";

// export class FavoriteItems {
//   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductGroup' })
//   productId: ProductGroupDocument;
//
//   @Prop({ default: Date.now() })
//   createdAt: Date;
// }


export type FavoriteDocument = HydratedDocument<Favorite>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Favorite extends BaseModel {
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customerId: CustomerDocument;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' })
  groupId: InventoryDocument;
  
}

const FavoriteSchema = SchemaFactory.createForClass(Favorite);
export { FavoriteSchema };
