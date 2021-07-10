import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from '../../config/config.keys';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ComposeGuard } from './guards/compose.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get(EnvConfig.JWT_SECRET),
          signOptions: { expiresIn: 864000000 },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RoleGuard,
    JwtAuthGuard,
    // provide global authentication to protect all endpoints
    {
      provide: APP_GUARD,
      useClass: ComposeGuard,
    },
  ],
})
export class AuthModule {}
