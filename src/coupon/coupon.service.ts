import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CouponDocument } from "./models/coupon.model";
import * as mongoose from 'mongoose';
import {
  CreateCouponRequest,
  DefaultResponse,
  GetCouponByIdRequest,
  GetCouponByTitleRequest,
} from "../shared/client-pb";



@Injectable()
export class CouponService {
  
  constructor(
    @InjectModel('Coupon') private readonly couponModel: Model<CouponDocument>,
  ) {
  }
  
  
  async getCouponByTitle(
    { title, planId } : GetCouponByTitleRequest
  )
    : Promise<DefaultResponse> {
    try {
      
      const coupon = await this.couponModel.findOne({
        title: new RegExp(`^${title}`, 'i'),
        $or: [
          { planId: null },  // Case 1: planId is null, no need to match.
          { planId: new mongoose.Types.ObjectId(planId) }, // Case 2: planId is not null, must match the provided planId.
        ],
      });
      
      if (!coupon) {
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Coupon not found.' },
        }
      }
      
      if (!coupon?.isValid) {
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Coupon not valid.' },
        }
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: coupon,
      }
      
    } catch (error) {
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      }
    }
  }
  
  async getCouponById(
    { couponId } : GetCouponByIdRequest
  )
    : Promise<DefaultResponse> {
    try {
      
      const coupon = await this.couponModel.findById(new mongoose.Types.ObjectId(couponId));
      
      if (!coupon) {
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Coupon not found.' },
        }
      }
      
      if (!coupon?.isValid) {
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Coupon not valid.' },
        }
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: coupon,
      }
      
    } catch (error) {
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      }
    }
  }
  
  async create(
    couponData  : CreateCouponRequest
  )
    : Promise<DefaultResponse> {
    try {
      
      const coupon = await this.couponModel.create({ ...couponData });
      
      if (!coupon) {
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Coupon created unsuccessfully.' },
        }
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: coupon,
      }
      
    } catch (error) {
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      }
    }
  }
  
}
