import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from '../../shared/base-model';
import { StatusEnum } from '../../shared/enums';
import mongoose from 'mongoose';
import { Cart } from './cart.model';
import { Address } from './address.model';
import { CreditCard } from './credit-card.model';
import { Favorite } from './favorite.model';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
class OTP {
  @Prop()
  value: number;
  
  @Prop()
  expiryTime: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);

@Schema({
  autoIndex: true,
  toJSON: { virtuals: true, getters: true },
  toObject: { virtuals: true, getters: true },
})
export class Customer extends BaseModel {
  @Prop({ trim: true, required: true })
  firstName: string;
  
  @Prop({ trim: true })
  lastName: string;
  
  @Prop({ trim: true })
  fullName: string;
  
  // @Prop({ default: 'Customer' })
  // role: string;
  
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
  
  @Prop()
  password: string;
  
  @Prop({ trim: true })
  phone: string;
  
  @Prop({ default: false })
  isEmailVerified: boolean;
  
  @Prop({ default: false })
  newsletterSubscribed: boolean;
  
  @Prop({ type: OTP })
  verificationToken: OTP;
  
  /**
   * Profile related Attributes
   */
  @Prop()
  profileURL: string;
  
  @Prop()
  thumbnailURL: string;
  
  @Prop({ type: String, enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;
  
  @Prop()
  isOnline: boolean;
  
  @Prop()
  accessToken: string;
  
  @Prop(String)
  deviceToken: string;
  
  @Prop({ default: null })
  sCustomerId: string; // Stripe Customer Id
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cart' })
  cartId: Cart;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Address' })
  addressId: Address;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CreditCard' })
  creditCardId: CreditCard;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Favorite' })
  favoritesId: Favorite;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ email: 1, sCustomerId: 1 });
CustomerSchema.pre<Customer>('save', async function (next) {
  try {
    console.error('in pre save middleware:');
    this.email = this.email.toLowerCase();
    this.fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
    next();
  } catch (error) {
    console.error('Error in pre save middleware:', error);
    next(error);
  }
});
// CustomerSchema.post<Customer>('save', async function (this: Customer & { constructor: Model<Customer> }, doc) {
//   try {
//     console.error("in post save:");
//     if (!doc.customerIDSeq) {
//       const customerIDSeq = String(doc.customerId).padStart(4, "0")
//       await this.constructor.findOneAndUpdate({ customerId: doc.customerId }, { customerIDSeq });
//     }
//   } catch (error) {
//     console.error("Error in post save:", error);
//   }
// });

export { CustomerSchema };
