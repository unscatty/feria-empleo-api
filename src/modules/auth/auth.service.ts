import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { IJwtPayload } from 'src/shared/interfaces/user.interfaces';
import { Repository } from 'typeorm';
import { EnvConfig } from '../../config/config.keys';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@Injectable()
export class AuthService {
  oauthClient = null;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.oauthClient = new OAuth2Client(config.get(EnvConfig.GOOGLE_ID));
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException(/* ErrorCodes.BAD_CREDENTIALS */);
    }
    if (await this.comparePassword(password, user.password)) {
      const { id, email, role } = user;
      const payload: IJwtPayload = {
        id,
        email,
        role,
      };
      const token = this.jwtService.sign(payload);
      return { token };
    } else {
      throw new BadRequestException();
    }
  }

  async loginGoogle(googleToken: string): Promise<{ token: string }> {
    try {
      const { email } = await this.googleVerify(googleToken);
      const userDb = await this.usersRepository.findOne({ email });
      if (userDb) {
        const { id, email, role } = userDb;
        const payload: IJwtPayload = {
          id,
          email,
          role,
        };
        const token = this.jwtService.sign(payload);
        return { token };
      }
    } catch (error) {
      throw new BadRequestException('BAD_CREDENTIALS');
    }
    throw new BadRequestException('BAD_CREDENTIALS');
  }

  async registerStudent(
    registerStudentDto: RegisterStudentDto,
  ): Promise<{ token: string }> {
    const { email, password } = registerStudentDto;
    // check if user with this email has already been registered
    const userExists = await this.usersRepository.findOne({
      email,
    });
    if (userExists) {
      throw new ConflictException('USER_ALREADY_EXISTS');
    }
    const hashPassword = await this.generateHashPassword(password);
    registerStudentDto.password = hashPassword;

    const newUser = this.usersRepository.create(registerStudentDto);
    await this.usersRepository.save(newUser);
    const { id, role } = newUser;
    const payload: IJwtPayload = {
      id,
      email,
      role,
    };
    const token = this.jwtService.sign(payload);
    return { token };
  }

  private async googleVerify(token: string) {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.config.get(EnvConfig.GOOGLE_ID),
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;
    return { name, email, picture };
  }

  private comparePassword = (
    password: string,
    hash: string,
  ): Promise<boolean> => {
    return compare(password, hash);
  };

  private generateHashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt(10);
    return await hash(password, salt);
  };
}
