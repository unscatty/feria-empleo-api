import { Injectable } from '@nestjs/common';
import { BearerStrategy, VerifyCallback } from 'passport-azure-ad';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { EnvConfig } from '../../../config/config.keys';
import { User } from 'src/modules/user/entities/user.entity';

const registerStrategyName = 'register';

@Injectable()
export class B2CRegisterStrategy extends PassportStrategy(BearerStrategy, registerStrategyName) {
  constructor(private config: ConfigService) {
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
    const { emails, given_name, family_name } = token;
    const email = emails[0];

    const user = new User();
    user.email = email;
    user.name = given_name;
    user.lastname = family_name;

    return user;
  }
}

export const RegisterGuard = AuthGuard(registerStrategyName);
