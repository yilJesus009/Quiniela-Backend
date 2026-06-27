import { Controller, Get, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';

@Controller('matches')
@UseGuards(AuthGuard('jwt'))
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @Get()
  findAll(
    @Query('phase')  phase?: string,
    @Query('status') status?: string,
    @Query('date')   date?: string,
    @Query('next')   next?: string,
  ) {
    return this.matchesService.findAll({ phase, status, date, next });
  }

  // IMPORTANTE: /updates debe ir ANTES de /:id para que NestJS no lo interprete como un ID
  @Get('updates')
  findUpdates(@Query('since') since?: string) {
    return this.matchesService.findUpdates(since);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.findOne(id);
  }
}
