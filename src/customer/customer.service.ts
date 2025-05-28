import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import {
  DefaultResponse, UpdateCartRequest,
} from "../shared/client-pb";
import { CartDocument } from "./models/cart.model";
import { I18nService } from 'nestjs-i18n';


@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Cart') private readonly cartModel: Model<CartDocument>,
    private readonly i18n: I18nService,
  ) {
  }
  
  async greetCustomer(lang: string) {
    return this.i18n.translate('common.HELLO', { lang });
  }
  
  async updateCart(
    cartData: UpdateCartRequest,
  ): Promise<DefaultResponse> {
    try {
      
      const transformedItems: any = cartData?.items?.map((item) => ({
        productId: new mongoose.Types.ObjectId(item?.product?._id),
        quantity:
          typeof item?.quantity === 'string'
            ? parseInt(item?.quantity)
            : item?.quantity,
      }));
      
      if (cartData.items) delete cartData.items;
      
      const cartUpdated = await this.cartModel.findOneAndUpdate(
        { customerId: 1 },
        {
          ...cartData,
          items: transformedItems,
        },
        { upsert: true, new: true });
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: cartUpdated,
      }
      
    } catch (error) {
      console.log('updateCart error', error)
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      }
    }
  }
  
}
