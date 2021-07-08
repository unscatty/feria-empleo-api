import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { GetUser } from './decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterStudentDto } from './dto/register-student.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Post('login/google')
  @Public()
  loginGoogle(@Body('token') googleToken: string): Promise<{ token: string }> {
    return this.authService.loginGoogle(googleToken);
  }

  @Post('register-student')
  @Public()
  registerStudent(
    @Body() registerStudentDto: RegisterStudentDto,
  ): Promise<{ token: string }> {
    return this.authService.registerStudent(registerStudentDto);
  }

  @Get('me')
  getMe(@GetUser() user: User): User {
    return user;
  }
}
