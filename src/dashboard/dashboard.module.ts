import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMember } from '../groups/group-member.entity';
import { Match } from '../matches/match.entity';
import { Prediction } from '../predictions/prediction.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMember, Match, Prediction])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
