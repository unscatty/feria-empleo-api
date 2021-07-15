import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { B2CAuthGuard } from './guards/b2c.guard';
import { ComposeGuard } from './guards/compose.guard';
import { RoleGuard } from './guards/role.guard';
import { B2CStrategy } from './strategies/b2c.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'oauth-bearer',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    B2CStrategy,
    RoleGuard,
    B2CAuthGuard,
    // provide global authentication to protect all endpoints
    {
      provide: APP_GUARD,
      useClass: ComposeGuard,
    },
  ],
})
export class AuthModule {}
