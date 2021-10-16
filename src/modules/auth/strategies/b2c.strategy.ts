import { BadRequestException, Injectable } from '@nestjs/common';
import { BearerStrategy, VerifyCallback } from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { Repository } from 'typeorm';

import { EnvConfig } from '../../../config/config.keys';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class B2CStrategy extends PassportStrategy(BearerStrategy) {
  public b2c: BearerStrategy;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private config: ConfigService
  ) {
    super({
      identityMetadata: config.get(EnvConfig.B2C_METADATA),
      clientID: config.get(EnvConfig.B2C_CLIENT_ID),
      policyName: config.get(EnvConfig.B2C_POLICY_NAME),
      isB2C: true,
      validateIssuer: false,
      loggingLevel: 'warn',
      loggingNoPII: false,
      passReqToCallback: true,
      allowMultiAudiencesInToken: true,
      audience: config.get(EnvConfig.B2C_CLIENT_ID),
    });
  }

  async validate(req: Request, token: any, done: VerifyCallback): Promise<User> {
    const email = token.emails[0];
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('NOT_USER_REGISTER');
    }
    return user;
  }
}
