import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import mongoose from "mongoose";
import { ProductDocument } from "../../product/models/product.model";


export class InventoryItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: ProductDocument;
}

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Inventory extends BaseModel {
  
  @Prop()
  name: string;
  
  @Prop({ default: null })
  featuredImage: string;
  
  @Prop([InventoryItems])
  items: InventoryItems[];
  
}

const InventorySchema = SchemaFactory.createForClass(Inventory);
InventorySchema.index({ name: 1 });
export { InventorySchema };
