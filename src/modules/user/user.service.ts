import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindManyOptions, Repository } from 'typeorm';
import { Candidate } from '../candidate/models/candidate.entity';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { Role, RoleType } from './entities/role.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>
  ) {}

  async findAll(filterUsersDto: FilterUsersDto): Promise<User[]> {
    const findQuery: FindManyOptions<User> = {
      where: { ...filterUsersDto },
      order: { createdAt: 'DESC' },
    };
    return this.usersRepository.find(findQuery);
  }

  async createUser(
    createUserDto: CreateUserDto,
    roleType: RoleType,
    manager?: EntityManager
  ): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (userAlreadyExists) {
      throw new ConflictException('USER_ALREADY_EXISTS');
    }
    const role = await this.preloadRole(roleType);
    const newUser = this.usersRepository.create({ ...createUserDto, role });

    if (manager) {
      return manager.save(newUser);
    } else {
      return this.usersRepository.save(newUser);
    }
  }

  async deleteUser(id: number): Promise<{ deleted: boolean }> {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }

  async createCompany(createUserDto: CreateUserDto, manager?: EntityManager) {
    return this.createUser(createUserDto, RoleType.COMPANY, manager);
  }

  async getCompany(currentUser: User): Promise<Company> {
    return this.companyRepository.findOneOrFail({ where: { user: currentUser } });
  }

  async getCandidate(currentUser: User): Promise<Candidate> {
    return this.candidateRepository.findOneOrFail({ where: { user: currentUser } });
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

  async preloadRole(name: RoleType): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({ name });

    if (existingRole) {
      return existingRole;
    }

    return this.roleRepository.create({ name });
  }
}
