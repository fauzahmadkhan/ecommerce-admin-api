import { ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

export let jwtAuthExecutionContext: ExecutionContext; // Global variable to store the ExecutionContext

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    jwtAuthExecutionContext = context; // Store the ExecutionContext in the static variable
    return super.canActivate(context);
  }

  handleRequest(err, isAuthenticated, info) {
    console.log('err', err);
    console.log('isAuthenticated', isAuthenticated);
    console.log('info', info);

    if (err || !isAuthenticated) {
      if (info && info.message) {
        if (info.message === 'No auth token') {
          throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
        } else if (info.message === 'invalid signature') {
          throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
        } else if (info.message === 'jwt expired') {
          throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
        }
      }

      throw new UnauthorizedException('Por favor, inicie sesión nuevamente.');
    }
    return isAuthenticated;
  }
}
