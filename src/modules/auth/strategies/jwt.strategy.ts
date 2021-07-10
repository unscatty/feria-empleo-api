import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/modules/user/user.entity';
import { IJwtPayload } from 'src/shared/interfaces/user.interfaces';
import { Repository } from 'typeorm';
import { EnvConfig } from '../../../config/config.keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(EnvConfig.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.usersRepository.findOne({ email });
    return user;
  }
}
