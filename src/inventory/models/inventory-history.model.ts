import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import mongoose from "mongoose";
import { ProductDocument } from "../../product/models/product.model";
import { InventoryAction } from "../../shared/enums"

export type InventoryHistoryDocument = HydratedDocument<InventoryHistory>;

@Schema({
  autoIndex: true,
  timestamps: true,
})
export class InventoryHistory extends BaseModel {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
  productId: ProductDocument;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  relatedProductId: ProductDocument;
  
  @Prop({ required: true })
  previousValue: number;
  
  @Prop({ required: true })
  newValue: number;
  
  @Prop({ required: true })
  change: number;
  
  @Prop({ enum: InventoryAction, required: true })
  action: InventoryAction;
  
  @Prop()
  notes: string;
}

const InventoryHistorySchema = SchemaFactory.createForClass(InventoryHistory);
InventoryHistorySchema.index({ productId: 1, timestamp: -1 });

export { InventoryHistorySchema };
