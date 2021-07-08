import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from './role.guard';

@Injectable()
export class ComposeGuard implements CanActivate {
  constructor(
    private jwtAuthGuard: JwtAuthGuard,
    private roleGuard: RoleGuard,
    private reflector: Reflector,
  ) {}

  // guard to call jwtAuthGuard and roleGuard at same time
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // short circuit  with public endpoints
    const publicRoute = this.reflector.get('public', context.getHandler());
    if (publicRoute) return true;

    return (
      (await this.jwtAuthGuard.canActivate(context)) &&
      (await this.roleGuard.canActivate(context))
    );
  }
}
