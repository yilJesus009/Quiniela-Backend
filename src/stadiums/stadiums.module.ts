// stadiums.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stadium } from './stadium.entity';
import { Match } from '../matches/match.entity';
import { StadiumsService } from './stadiums.service';
import { StadiumsController } from './stadiums.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stadium, Match])],
  controllers: [StadiumsController],
  providers: [StadiumsService],
})
export class StadiumsModule {}
