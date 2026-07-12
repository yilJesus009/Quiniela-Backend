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

// NUEVO: se cambia de @Controller('admin/matches') a @Controller('admin')
// para conservar /admin/matches y poder agregar /admin/dashboard.
@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // NUEVO: antes era @Post() porque el controller era admin/matches.
  @Post('matches')
  createMatch(@Body() dto: CreateMatchDto) {
    return this.adminService.createMatch(dto);
  }

  // NUEVO: antes era @Patch(':id') porque el controller era admin/matches.
  @Patch('matches/:id')
  updateMatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatchDto,
  ) {
    return this.adminService.updateMatch(id, dto);
  }

  // NUEVO: endpoint usado por el dashboard admin del FRONT 2.
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboardStats();
  }
}
