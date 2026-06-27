import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getProfile(@CurrentUser() user: { id: number }) {
    return this.usersService.getProfile(user.id);
  }
}
