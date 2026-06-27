import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from './prediction.entity';
import { Match } from '../matches/match.entity';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction, Match])],
  controllers: [PredictionsController],
  providers: [PredictionsService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
