import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(filterUsersDto: FilterUsersDto): Promise<User[]> {
    const findQuery: FindManyOptions<User> = {
      where: { ...filterUsersDto },
      order: { createdAt: 'DESC' },
    };
    return this.usersRepository.find(findQuery);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (userAlreadyExists) {
      throw new ConflictException();
    }
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async deleteUser(id: number): Promise<{ deleted: boolean }> {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }

  /* async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const foundUser = await this._userRepository.findOne(userId, {
      where: { status: EEstatus.ACTIVE },
    });
    if (!foundUser) {
      throw new NotFoundException('user does not exist');
    }
    foundUser.username = user.username;

    const updatedUser = await this._userRepository.save(foundUser);
    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(userId: number): Promise<void> {
    const userExist = await this._userRepository.findOne(userId, {
      where: { status: EEstatus.ACTIVE },
    });
    if (!userExist) {
      throw new NotFoundException();
    }
    await this._userRepository.update(userId, { status: EEstatus.INACTIVE });
  } */
}
