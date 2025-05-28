import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SaleDocument } from "./models/sale.model";
import * as mongoose from 'mongoose';
import { DefaultResponse, CreateSaleRequest, UpdateSaleRequest } from "../shared/client-pb";
import { CustomerDocument } from "../customer/models/customer.model";
import { ProductDocument } from "../product/models/product.model";
import { CouponDocument } from "../coupon/models/coupon.model";


@Injectable()
export class SaleService {
  
  // @Inject(MailerService)
  // private readonly mailerService: MailerService;
  
  // @Inject(StripeService)
  // private readonly stripeService: StripeService;
  
  // @Inject(HelpersService)
  // private readonly helpersService: HelpersService;
  
  constructor(
    @InjectModel('Sale') private readonly saleModel: Model<SaleDocument>,
    @InjectModel('Customer') private readonly customerModel: Model<CustomerDocument>,
    @InjectModel('Product') private readonly productModel: Model<ProductDocument>,
    @InjectModel('Coupon') private readonly couponModel: Model<CouponDocument>,
  ) {
  }
  
  async getSaleById(
    id: string
  ): Promise<DefaultResponse> {
    try {
      const saleRecord = await this.saleModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
          },
        },
        { $unwind: '$customer' },
        {
          $lookup: {
            from: 'addresses',
            localField: 'customerId',
            foreignField: 'customerId',
            as: 'address',
          },
        },
        { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $addFields: {
            items: {
              $map: {
                input: '$items',
                as: 'item',
                in: {
                  $mergeObjects: [
                    '$$item',
                    {
                      product: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$productDetails',
                              as: 'product',
                              cond: { $eq: ['$$product._id', '$$item.productId'] }
                            }
                          },
                          0
                        ]
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $project: {
            productDetails: 0,
            'customer.password': 0,
          }
        }
      ]);
      
      const sale = saleRecord.length > 0 ? saleRecord[0] : {};
      
      if (!sale?._id) {
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          data: { message: 'Record not found.' },
        };
      }
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: sale,
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
  
  
  async placeSale(saleData: CreateSaleRequest): Promise<DefaultResponse> {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      console.log('saleData', saleData);
      
      // Validating customer exists
      const customer = await this.customerModel.findById(
        new mongoose.Types.ObjectId(saleData?.customerId),
      ).session(session);
      
      if (!customer?._id) {
        await session.abortTransaction();
        return {
          success: false,
          statusCode: HttpStatus.OK,
          data: { message: 'Customer not found' },
        };
      }
      
      // Transforming items and validate products/inventory
      const transformedItems = await Promise.all(
        saleData?.items?.map(async (item) => {
          const productId = new mongoose.Types.ObjectId(item?.product?._id);
          
          // Checking product exists and has sufficient inventory
          const product = await this.productModel.findById(productId).session(session);
          
          if (!product) {
            throw new Error(`Product ${item.product._id} not found`);
          }
          
          return {
            productId,
            quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
            price: product.price // Included price at time of sale
          };
        }) || []
      );
      
      // Creating sale record
      const salePlaced = await this.saleModel.create({
        ...saleData,
        items: transformedItems,
        totalAmount: transformedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      }, { session });
      
      await Promise.all(
        transformedItems.map(async (item) => {
          await this.productModel.updateOne(
            { _id: item.productId },
            {
              // Decrement units by item.quantity
              // $inc: { units: -item.quantity },
              $set: { available: false },
            },
          );
        })
      );
      
      await session.commitTransaction();
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: salePlaced,
      };
    } catch (error) {
      await session.abortTransaction();
      console.error('place sale error', error);
      
      return {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: { message: error.message },
        error: error.name
      };
    } finally {
      await session.endSession();
    }
  }
  
  async listCustomerSales(userId: string): Promise<DefaultResponse> {
    try {
      if (userId) {
        const sales = await this.saleModel.find({ customerId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
        if (sales) {
          return {
            success: true,
            statusCode: HttpStatus.OK,
            data: sales,
          }
        }
        
        return {
          success: false,
          statusCode: HttpStatus.NOT_FOUND,
          data: { message: 'Records not found.' },
        }
      }
      
      return {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        data: { message: 'Please provide customerId.' },
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
  
  async getSalesByStatus(status: string): Promise<DefaultResponse> {
    try {
      const sales = await this.saleModel.find({ status }).sort({ createdAt: -1 });
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: sales,
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
  
  async getSalesAnalytics(timeframe: 'daily' | 'weekly' | 'monthly' | 'annual'): Promise<DefaultResponse> {
    try {
      let groupByFormat, dateRange;
      
      switch (timeframe) {
        case 'daily':
          groupByFormat = '%Y-%m-%d';
          dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
          break;
        case 'weekly':
          groupByFormat = '%Y-%U';
          dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Last year
          break;
        case 'monthly':
          groupByFormat = '%Y-%m';
          dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // Last year
          break;
        case 'annual':
          groupByFormat = '%Y';
          dateRange = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000); // Last 5 years
          break;
        default:
          groupByFormat = '%Y-%m-%d';
          dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }
      
      const analytics = await this.saleModel.aggregate([
        {
          $match: {
            createdAt: { $gte: dateRange },
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: groupByFormat, date: "$createdAt" }
            },
            totalSales: { $sum: 1 },
            totalRevenue: { $sum: "$totalPrice" },
            averageOrderValue: { $avg: "$totalPrice" }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: analytics,
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
  
  async getSalesComparison(period1: string, period2: string): Promise<DefaultResponse> {
    try {
      const getPeriodDates = (period: string) => {
        const now = new Date();
        switch (period) {
          case 'currentWeek':
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            return { start: startOfWeek, end: new Date() };
          case 'lastWeek':
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            const startOfLastWeek = new Date(lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay()));
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(endOfLastWeek.getDate() + 6);
            return { start: startOfLastWeek, end: endOfLastWeek };
          case 'currentMonth':
            return {
              start: new Date(now.getFullYear(), now.getMonth(), 1),
              end: new Date()
            };
          case 'lastMonth':
            return {
              start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
              end: new Date(now.getFullYear(), now.getMonth(), 0)
            };
          default:
            return {
              start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
              end: new Date()
            };
        }
      };
      
      const period1Dates = getPeriodDates(period1);
      const period2Dates = getPeriodDates(period2);
      
      const [period1Data, period2Data] = await Promise.all([
        this.saleModel.aggregate([
          {
            $match: {
              createdAt: { $gte: period1Dates.start, $lte: period1Dates.end },
            }
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: 1 },
              totalRevenue: { $sum: "$totalPrice" },
              averageOrderValue: { $avg: "$totalPrice" }
            }
          }
        ]),
        this.saleModel.aggregate([
          {
            $match: {
              createdAt: { $gte: period2Dates.start, $lte: period2Dates.end },
            }
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: 1 },
              totalRevenue: { $sum: "$totalPrice" },
              averageOrderValue: { $avg: "$totalPrice" }
            }
          }
        ])
      ]);
      
      const result = {
        period1: {
          name: period1,
          ...period1Dates,
          data: period1Data[0] || { totalSales: 0, totalRevenue: 0, averageOrderValue: 0 }
        },
        period2: {
          name: period2,
          ...period2Dates,
          data: period2Data[0] || { totalSales: 0, totalRevenue: 0, averageOrderValue: 0 }
        },
        comparison: {
          salesChange: ((period1Data[0]?.totalSales || 0) - (period2Data[0]?.totalSales || 0)) /
            (period2Data[0]?.totalSales || 1) * 100,
          revenueChange: ((period1Data[0]?.totalRevenue || 0) - (period2Data[0]?.totalRevenue || 0)) /
            (period2Data[0]?.totalRevenue || 1) * 100
        }
      };
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: result,
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
  
  async getSalesByProduct(): Promise<DefaultResponse> {
    try {
      const productSales = await this.saleModel.aggregate([
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$items.productId",
            productName: { $first: "$product.name" },
            totalSold: { $sum: "$items.quantity" },
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ]);
      
      return {
        success: true,
        statusCode: HttpStatus.OK,
        data: productSales,
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
