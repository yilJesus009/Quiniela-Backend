// predictions.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PredictionsService } from './predictions.service';
import { CreatePredictionDto } from './predictions.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('predictions')
@UseGuards(AuthGuard('jwt'))
export class PredictionsController {
  constructor(private predictionsService: PredictionsService) {}

  @Post()
  @HttpCode(201)
  upsert(
    @Body() dto: CreatePredictionDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.predictionsService.upsert(dto, user.id);
  }

  @Get('me')
  findMyPredictions(@CurrentUser() user: { id: number }) {
    return this.predictionsService.findMyPredictions(user.id);
  }
}
