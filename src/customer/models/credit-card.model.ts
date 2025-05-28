import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../../shared/base-model';
import mongoose from 'mongoose';
import { Customer, CustomerSchema } from './customer.model';

export type CreditCardDocument = HydratedDocument<CreditCard>;

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class CreditCard extends BaseModel {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  })
  customerId: Customer;

  @Prop({ required: true, trim: true })
  cardNumber: string;

  @Prop({ required: true, trim: true })
  cardHolderName: string;

  @Prop({ required: true, trim: true })
  expiry: string;

  @Prop({ required: true })
  cvc: number;

  @Prop({ trim: true })
  countryOrRegion: string;

  @Prop({ default: true })
  isPrimary: boolean;
}

const CreditCardSchema = SchemaFactory.createForClass(CreditCard);
// CreditCardSchema.index({ cardNumber: 1 });

export { CreditCardSchema };
