import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matches/match.entity';
import { Stadium } from '../stadiums/stadium.entity';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { PredictionsModule } from '../predictions/predictions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Stadium]), PredictionsModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
