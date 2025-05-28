// import {
//   Injectable,
//   Inject,
//   UnauthorizedException,
//   ExecutionContext,
// } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { JwtService } from '../services/jwt.service';
// import * as dotenv from 'dotenv';
// import { jwtAuthExecutionContext } from '../guards';
// dotenv.config();
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   @Inject(JwtService)
//   private readonly jwtService: JwtService;
//
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       secretOrKey: `${process.env.JWT_TOKEN_SECRET}`,
//       ignoreExpiration: false,
//     });
//   }
//
//   private async validate(payload: any): Promise<any | never> {
//     const context: ExecutionContext = jwtAuthExecutionContext;
//     if (context) {
//       const request = context.switchToHttp().getRequest();
//       const accessToken = request.get('Authorization');
//       const customer: any = await this.jwtService.validateCustomer({
//         id: payload.userId,
//       });
//       if (customer?.accessToken === accessToken) {
//         payload['role'] = customer.role || 'Customer';
//         return new Promise((resolve) => resolve(payload));
//       }
//       else {
//         const user: any = await this.jwtService.validateSystemUser({
//           id: payload.userId,
//         });
//
//         if (user?.accessToken === accessToken) {
//           payload['role'] = user.role;
//           return new Promise((resolve) => resolve(payload));
//         } else {
//           throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
//         }
//       }
//     }
//     throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
//   }
// }
