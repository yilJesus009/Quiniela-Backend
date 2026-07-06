import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { BootstrapAdminDto, LoginDto, RegisterDto } from './auth.dto';
import { ExtractJwt } from 'passport-jwt';

@Controller() // sin prefijo extra — las rutas serán /api/register, /api/login, /api/logout
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('bootstrap/admin')
  bootstrapAdmin(@Body() dto: BootstrapAdminDto) {
    return this.authService.bootstrapAdmin(dto);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req: any) {
    const rawToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? '';
    return this.authService.logout(rawToken);
  }
}
