import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType, User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allow = this.reflector.get<RoleType[]>('allow', context.getHandler());
    const deny = this.reflector.get<RoleType[]>('deny', context.getHandler());
    if (!allow && !deny) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    const userRole = user.role;
    return allow ? allow.includes(userRole) : !deny.includes(userRole);
  }
}
