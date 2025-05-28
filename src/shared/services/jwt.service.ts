// import { Injectable } from '@nestjs/common';
// import { JwtService as Jwt } from '@nestjs/jwt';
// import * as bcrypt from 'bcryptjs';
// import { InjectModel } from '@nestjs/mongoose';
// import mongoose, { Model, Types } from 'mongoose';
// import { CustomerDocument, Customer } from '../../customer/models/customer.model';
// import { SystemUserDocument } from "../../system-user/models/system-user.model";
//
// const { ObjectId } = Types;
//
// @Injectable()
// export class JwtService {
//   @InjectModel('Customer') private readonly customerModel: Model<CustomerDocument>;
//   @InjectModel('SystemUser') private readonly systemUserModel: Model<SystemUserDocument>;
//
//   private readonly jwt: Jwt;
//
//   constructor(jwt: Jwt) {
//     this.jwt = jwt;
//   }
//
//   // Decoding the JWT Token
//   public async decode(token: string): Promise<unknown> {
//     return this.jwt.decode(token, null);
//   }
//
//   // Get Customer by Customer ID we get from decode()
//   public async validateCustomer(decoded: any): Promise<any> {
//     // console.log('decoded.id', decoded.id)
//     const customer = await this.customerModel.findById({ _id: new mongoose.Types.ObjectId(decoded.id) });
//     // console.log('decoded customer', customer)
//     let response = JSON.parse(JSON.stringify(customer))
//     // if (customer && decoded.accessToken.localeCompare(customer.accessToken) !== 0)
//     //   response = { message: 'Oops! It looks like the token you provided isn\'t associated with any account!' }
//     // else
//     //   response = JSON.parse(JSON.stringify(customer));
//
//     return response;
//   }
//
//   public async validateSystemUser(decoded: any): Promise<any> {
//     const user = await this.systemUserModel.findById({ _id: new ObjectId(decoded.id) });
//     return JSON.parse(JSON.stringify(user));
//   }
//
//   // Generate JWT Token
//   public generateToken(payload: any): string {
//     const token = this.jwt.sign({
//       userId: payload.userId,
//       email: payload.email,
//     });
//     return `Bearer ${token}`;
//   }
//
//   // Validate Customer's password
//   public isPasswordValid(password: string, userPassword: string): boolean {
//     return bcrypt.compareSync(password, userPassword);
//   }
//
//   // Encode Customer's password
//   public encodePassword(password: string): string {
//     const salt: string = bcrypt.genSaltSync(10);
//
//     return bcrypt.hashSync(password, salt);
//   }
//
//   // Validate JWT Token, throw forbidden error if JWT Token is invalid
//   public async verify(token: string): Promise<any> {
//     try {
//       console.log('in verify')
//       return this.jwt.verify(token);
//     } catch (err) {
//       console.log('jwt-service verify err', err)
//     }
//   }
// }
