import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiLogin, ApiRegister } from './decorators/swagger.decorators';
import { Public } from '../../common/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Public()
  @Post('register')
  @ApiRegister()
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  // @Public()
  @Post('login')
  @ApiLogin()
  async login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
