import { IsInt, Min } from 'class-validator';

export class CreatePredictionDto {
  @IsInt()
  match_id: number;

  @IsInt()
  @Min(0)
  home_score: number;

  @IsInt()
  @Min(0)
  away_score: number;
}
