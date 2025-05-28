import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { RoleEnum } from '../enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);
