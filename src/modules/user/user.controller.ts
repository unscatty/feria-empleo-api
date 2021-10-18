import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Allow } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { Candidate } from '../candidate/models/candidate.entity';
import { Company } from '../company/entities/company.entity';
import { CreateUserDto, FilterUsersDto } from './dto';
import { RoleGroup } from './entities/role.entity';
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
  // WARN: This should be the only place where CURRENT_USER group must be used
  @SerializeOptions({ groups: [RoleGroup.CURRENT_USER] })
  async currentUser(@GetUser() user: User): Promise<Candidate | Company | { user: User }> {
    switch (user.role.name) {
      case RoleType.ADMIN:
        return { user: classToPlain(user) as User };
      case RoleType.CANDIDATE:
        return this.userService.getCandidate(user);
      case RoleType.COMPANY:
        return this.userService.getCompany(user);
    }
  }
}
