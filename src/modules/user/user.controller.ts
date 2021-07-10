import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Allow } from '../auth/decorators/role.decorator';
import { CreateUserDto, FilterUsersDto } from './dto';
import { RoleType } from './user.entity';
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
    return this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  @Allow(RoleType.ADMIN)
  deleteUser(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.userService.deleteUser(id);
  }
}
