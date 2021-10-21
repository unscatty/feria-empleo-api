import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { deserialize, serialize } from 'class-transformer';
import { Allow } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { Candidate } from '../candidate/models/candidate.entity';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto, FilterUsersDto } from './dto';
import { RoleType, User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Allow(RoleType.ADMIN)
  findAllUsers(@Query() filterUsersDto?: FilterUsersDto) {
    return this.userService.findAll(filterUsersDto);
  }

  @Post()
  @Allow(RoleType.ADMIN)
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto, null);
  }

  @Delete(':id')
  @Allow(RoleType.ADMIN)
  deleteUser(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.userService.deleteUser(id);
  }

  // Serialize admin for an homogeneous response
  @Get('current-user')
  currentUser(@GetUser() user: User): Promise<Company | Candidate> | { user: User } {
    switch (user.role.name) {
      case RoleType.ADMIN:
        // do manual serialize object {user}
        const userSerialize = serialize(user);
        return { user: deserialize(User, userSerialize) };
      case RoleType.CANDIDATE:
        return this.userService.getCandidate(user);
      case RoleType.COMPANY:
        return this.userService.getCompany(user);
    }
  }
}
