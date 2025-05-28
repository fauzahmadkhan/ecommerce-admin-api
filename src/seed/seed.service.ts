import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../product/models/product.model';
import { Inventory } from '../inventory/models/inventory.model';
import * as mongoose from 'mongoose';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectModel('Product') private productModel: Model<Product>,
    @InjectModel('Inventory') private inventoryModel: Model<Inventory>,
  ) {
  }
  
  async onModuleInit() {
    await this.seedDatabase();
  }
  
  private async seedDatabase() {
    const productsCount = await this.productModel.countDocuments();
    
    if (productsCount === 0) {
      // Create sample products
      const sampleProducts = [
        { barcode: '0000001', name: 'Laptop', description: 'High performance laptop', price: 999.99, available: true },
        { barcode: '0000002', name: 'Smartphone', description: 'Latest smartphone', price: 699.99, available: true },
        { barcode: '0000003', name: 'Headphones', description: 'Noise cancelling headphones', price: 199.99, available: true },
        { barcode: '0000004', name: 'T-Shirt', description: 'Cotton t-shirt', price: 19.99, available: true },
        { barcode: '0000005', name: 'Jeans', description: 'Slim fit jeans', price: 49.99, available: true },
      ];
      
      const createdProducts = await this.productModel.insertMany(sampleProducts);
      
      
      // Creating inventory records
      for (let product of createdProducts) {
        
        if (!product?.inventoryId) {
          const { name } = product;
          
          const inventory = await this.inventoryModel.findOne({ name });
          
          if (inventory?._id) {
            await this.inventoryModel.updateOne(
              { _id: inventory?._id },
              { $push: { items: { productId: product?._id } } }
            )
            
            await this.productModel.updateOne({ _id: product?._id },
              {
                $set: {
                  inventoryId: inventory?._id,
                  featuredImage: inventory?.featuredImage,
                }
              })
          } else {
            
            let newInventory = await this.inventoryModel.create({
              name, items: [{ productId: product?._id }]
            });
            
            await this.productModel.updateOne({ _id: product?._id },
              {
                $set: {
                  inventoryId: newInventory?._id,
                  featuredImage: newInventory?.featuredImage,
                }
              })
            
          }
          
        }
        
      }
      
      console.log('Records created successfully');
      
      
      // const session = await mongoose.startSession();
      // session.startTransaction();
      //
      // try {
      //   for (const product of createdProducts) {
      //     if (!product?.inventoryId) {
      //       const { name } = product;
      //
      //       const inventory = await this.inventoryModel.findOne({ name }).session(session);
      //
      //       if (inventory?._id) {
      //         await Promise.all([
      //           this.inventoryModel.updateOne(
      //             { _id: inventory._id },
      //             { $push: { items: { productId: product._id } } },
      //             { session }
      //           ),
      //           this.productModel.updateOne(
      //             { _id: product._id },
      //             {
      //               $set: {
      //                 inventoryId: inventory._id,
      //                 featuredImage: inventory.featuredImage,
      //               }
      //             },
      //             { session }
      //           )
      //         ]);
      //       } else {
      //
      //         const newInventory = await this.inventoryModel.create([{
      //           name,
      //           items: [{ productId: product._id }]
      //         }], { session });
      //
      //         await this.productModel.updateOne(
      //           { _id: product._id },
      //           {
      //             $set: {
      //               inventoryId: newInventory[0]._id,
      //               featuredImage: newInventory[0].featuredImage,
      //             }
      //           },
      //           { session }
      //         );
      //       }
      //     }
      //   }
      //
      //   await session.commitTransaction();
      // } catch (error) {
      //   await session.abortTransaction();
      //   throw error;
      // } finally {
      //   await session.endSession();
      // }
      
    }
  }
}
