import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { Allow } from '../auth/decorators/role.decorator';
import { GetUser } from '../auth/decorators/user.decorator';
import { RegisterGuard } from '../auth/strategies/b2c-register.strategy';
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

  @Post('register-candidate')
  @Public()
  @UseGuards(RegisterGuard)
  register(@GetUser() user: User) {
    const dto = new CreateUserDto();
    dto.email = user.email;
    dto.username = '';

    return this.userService.createCandidate(dto);
  }

  @Delete(':id')
  @Allow(RoleType.ADMIN)
  deleteUser(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.userService.deleteUser(id);
  }
}
