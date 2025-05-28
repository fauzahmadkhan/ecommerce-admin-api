import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { InventoryDocument } from './models/inventory.model';
import { ProductDocument } from '../product/models/product.model';
import { DefaultResponse } from '../shared/client-pb';
import { InventoryHistoryDocument } from "./models/inventory-history.model";

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel('Inventory') private readonly inventoryModel: Model<InventoryDocument>,
    @InjectModel('InventoryHistory') private readonly inventoryHistoryModel: Model<InventoryHistoryDocument>,
    @InjectModel('Product') private readonly productModel: Model<ProductDocument>,
  ) {
  }
  
  async getInventoryStatus(): Promise<DefaultResponse> {
    try {
      const inventory = await this.inventoryModel.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        {
          $addFields: {
            availableItems: {
              $filter: {
                input: '$productDetails',
                as: 'product',
                cond: { $eq: ['$$product.available', true] }
              }
            },
            unavailableItems: {
              $filter: {
                input: '$productDetails',
                as: 'product',
                cond: { $eq: ['$$product.available', false] }
              }
            },
            totalItems: { $size: '$items' },
            availableCount: {
              $size: {
                $filter: {
                  input: '$productDetails',
                  as: 'product',
                  cond: { $eq: ['$$product.available', true] }
                }
              }
            }
          }
        },
        {
          $project: {
            name: 1,
            featuredImage: 1,
            totalItems: 1,
            availableCount: 1,
            availableItems: {
              _id: 1,
              name: 1,
              available: 1
            },
            unavailableItems: {
              _id: 1,
              name: 1,
              available: 1
            }
          }
        }
      ]);
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: inventory,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      };
    }
  }
  
  async updateProductAvailability(
    productId: string,
    available: boolean
  ): Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const updatedProduct = await this.productModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $set: { available } },
        { new: true, session }
      );
      
      if (!updatedProduct) {
        await session.abortTransaction();
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          data: { message: 'Product not found' },
        };
      }
      
      // await this.createInventoryHistory({
      //   productId: updatedProduct._id.toString(),
      //   previousValue: previousStatus ? 1 : 0,
      //   newValue: newStatus ? 1 : 0,
      //   action: newStatus ? InventoryAction.ADD : InventoryAction.SUBTRACT,
      //   notes: notes || (newStatus ? 'Product marked as available' : 'Product marked as unavailable'),
      // });
      
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: updatedProduct,
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
  
  async moveProductBetweenInventories(
    productId: string,
    fromInventoryId: string,
    toInventoryId: string
  ): Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const removeResult = await this.inventoryModel.updateOne(
        { _id: new mongoose.Types.ObjectId(fromInventoryId) },
        { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
        { session }
      );
      
      if (removeResult.modifiedCount === 0) {
        await session.abortTransaction();
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          data: { message: 'Product not found in source inventory' },
        };
      }
      
      await this.inventoryModel.updateOne(
        { _id: new mongoose.Types.ObjectId(toInventoryId) },
        { $addToSet: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
        { session }
      );
      
      await this.productModel.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $set: { inventoryId: new mongoose.Types.ObjectId(toInventoryId) } },
        { session }
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: { message: 'Product moved successfully' },
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
  
  async createInventoryHistory(
    { productId, relatedProductId, previousValue, newValue, change, action, notes })
    : Promise<DefaultResponse> {
    try {
      const history = await this.inventoryHistoryModel.create({
        productId,
        relatedProductId,
        previousValue,
        newValue,
        change,
        action,
        notes,
      });
      
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: history,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
        error,
      };
    }
  }
}
