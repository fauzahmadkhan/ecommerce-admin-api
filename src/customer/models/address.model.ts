import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseModel } from "../../shared/base-model";
import mongoose from "mongoose";
import { Customer } from "./customer.model";


export type AddressDocument = HydratedDocument<Address>;

@Schema({
   autoIndex: true,
   toJSON: { virtuals: true, getters: true },
   toObject: { virtuals: true, getters: true },
})
export class Address extends BaseModel {
   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true })
   customerId: Customer;
   
   @Prop({ required: true, trim: true })
   firstName: string;
   
   @Prop({ trim: true })
   lastName: string;
   
   @Prop({ trim: true })
   fullName: string;
   
   @Prop({ required: true, trim: true })
   address: string;
   
   @Prop({ trim: true })
   locality: string;
   
   @Prop({ trim: true })
   province: string;
   
   @Prop({ trim: true })
   country: string;
   
   @Prop()
   cp: string;
   
   @Prop({ trim: true })
   phone: string;
   
}

const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.pre<Address>('save', async function (next) {
   try {
      console.error("in pre save middleware:");
      this.fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
      next();
   } catch (error) {
      console.error("Error in pre save middleware:", error);
      next(error);
   }
});

export { AddressSchema };
