import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import * as mongoose from 'mongoose';
import { PlanDurationEnum, PlanTypeEnum } from "../../shared/enums";
import { ProductDocument } from "../../product/models/product.model";

export class PlanItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  productId: ProductDocument;
  
  @Prop()
  quantity: number;
  
}

export type PlanDocument = HydratedDocument<Plan>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Plan extends BaseModel {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  maxLimit: number;

  @Prop({ type: String, enum: PlanDurationEnum, default: PlanDurationEnum.MENSUAL })
  duration: PlanDurationEnum;

  @Prop({ type: String, enum: PlanTypeEnum, default: PlanTypeEnum.PERSONALIZED })
  type: PlanTypeEnum;

  @Prop([PlanItems])
  items: PlanItems[];

  @Prop([String])
  freeStyleDescriptionItems: string[];
}

const PlanSchema = SchemaFactory.createForClass(Plan);

export { PlanSchema };
