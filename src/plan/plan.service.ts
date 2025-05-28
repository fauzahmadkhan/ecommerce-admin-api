import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PlanDocument } from "./models/plan.model";
import {
  CreatePlanRequest,
  DefaultResponse,
  UpdatePlanRequest,
} from "../shared/client-pb";
import * as mongoose from 'mongoose';
import { PlanTypeEnum } from "../shared/enums";


@Injectable()
export class PlanService {
  
  constructor(
    @InjectModel('Plan') private readonly planModel: Model<PlanDocument>,
  ) {
  }
  
  async createPlan(
    planData: CreatePlanRequest)
    : Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const planCreated = await this.planModel.findOneAndUpdate(
        {
          title: planData.title,
          type: planData.type,
          price: planData.price,
          duration: planData.duration,
          maxLimit: planData.maxLimit
        },
        { ...planData },
        { upsert: true, new: true, session },
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.CREATED,
        data: planCreated,
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      };
    } finally {
      await session.endSession();
    }
  }
  
  async getAllPlanRecords(): Promise<DefaultResponse> {
    try {
      const personalizedPlans = await this.planModel
        .find({ type: PlanTypeEnum.PERSONALIZED })
        .sort({ price: 1 });
      
      const surprisedPlans = await this.planModel
        .find({ type: PlanTypeEnum.SURPRISED })
        .sort({ price: 1 });
      
      
      return {
        data: { personalizedPlans, surprisedPlans },
        statusCode: HttpStatus.OK,
        success: true,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.OK,
        data: { message: 'Plans retrieved unsuccessfully.' },
        error,
        success: false,
      };
    }
  }
  
  async getPlanById(
    id: string
  ): Promise<DefaultResponse> {
    try {
      const planRecord = await this.planModel.findById({
        _id: new mongoose.Types.ObjectId(id)
      });
      if (!planRecord) {
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          data: { message: 'Record not found.' }
        }
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: planRecord
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
  
  async updatePlan(
    planData: UpdatePlanRequest
  ): Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const planUpdated = await this.planModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(planData._id) },
        { ...planData },
        { upsert: true, new: true, session },
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: planUpdated,
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      };
    } finally {
      await session.endSession();
    }
  }
  
  async deletePlanById(id: string): Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const planDeleted = await this.planModel.findByIdAndDelete(
        new mongoose.Types.ObjectId(id),
        { session }
      );
      
      if (!planDeleted) {
        await session.abortTransaction();
        return {
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          data: { message: 'Record deleted unsuccessfully.' }
        };
      }
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: planDeleted
      };
    } catch (error) {
      await session.abortTransaction();
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      };
    } finally {
      await session.endSession();
    }
  }
}
