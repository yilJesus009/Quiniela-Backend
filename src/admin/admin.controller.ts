import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminService } from './admin.service';
import { CreateMatchDto, UpdateMatchDto } from './admin.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('matches')
  createMatch(@Body() dto: CreateMatchDto) {
    return this.adminService.createMatch(dto);
  }

  @Patch('matches/:id')
  updateMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.adminService.updateMatch(id, dto);
  }

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }
}
