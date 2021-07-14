import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { B2CAuthGuard } from './b2c.guard';
import { RoleGuard } from './role.guard';

@Injectable()
export class ComposeGuard implements CanActivate {
  constructor(
    private b2cAuthGuard: B2CAuthGuard,
    private roleGuard: RoleGuard,
    private reflector: Reflector,
  ) {}

  // guard to call B2CAuthGuard and roleGuard at same time
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // short circuit  with public endpoints
    const publicRoute = this.reflector.get('public', context.getHandler());
    if (publicRoute) return true;

    return (
      (await this.b2cAuthGuard.canActivate(context)) &&
      (await this.roleGuard.canActivate(context))
    );
  }
}
