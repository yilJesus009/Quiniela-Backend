import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matches/match.entity';
import { SyncService } from './sync.service';
import { PredictionsModule } from '../predictions/predictions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), PredictionsModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
