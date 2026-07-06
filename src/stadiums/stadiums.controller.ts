import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StadiumsService } from './stadiums.service';

@Controller('stadiums')
@UseGuards(AuthGuard('jwt'))
export class StadiumsController {
  constructor(private stadiumsService: StadiumsService) {}

  @Get()
  findAll() {
    return this.stadiumsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stadiumsService.findOne(id);
  }

  @Get(':id/matches')
  findMatches(@Param('id', ParseIntPipe) id: number) {
    return this.stadiumsService.findMatchesByStadium(id);
  }
}
