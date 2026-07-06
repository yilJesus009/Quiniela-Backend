import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards/admin.guard';
import {
  SyncDayQueryDto,
  SyncFixtureQueryDto,
  SyncRangeQueryDto,
} from './sync.dto';
import { SyncService } from './sync.service';

@Controller('admin/sync')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('the-sports-db/day')
  syncSportsDbDay(@Query() query: SyncDayQueryDto) {
    const date = query.date ?? new Date().toISOString().split('T')[0];
    return this.syncService.syncMatchesByDate(date);
  }

  @Post('the-sports-db/fixture')
  syncSportsDbFixture(@Query() query: SyncFixtureQueryDto) {
    return this.syncService.syncMatchByTeams(
      query.date,
      query.home_team,
      query.away_team,
    );
  }

  @Post('the-sports-db/range')
  syncSportsDbRange(@Query() query: SyncRangeQueryDto) {
    return this.syncService.syncMatchesByRange(query.start, query.end);
  }
}
