import { BearerStrategy } from 'passport-azure-ad';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { B2CCallback, B2COptions } from './b2c.conf';
import { IJwtPayload } from 'src/shared/interfaces/user.interfaces';
import { User } from 'src/modules/user/user.entity';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(BearerStrategy) {
  public b2c: BearerStrategy;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super(B2COptions, B2CCallback);
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { email } = payload;
    const user = await this.usersRepository.findOne({ email });
    return user;
  }
}
