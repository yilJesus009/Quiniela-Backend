import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class SyncDayQueryDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}
export class SyncRangeQueryDto {
  @IsDateString()
  start: string;

  @IsDateString()
  end: string;
}

export class SyncFixtureQueryDto {
  @IsDateString()
  date: string;

  @IsString()
  @MinLength(1)
  home_team: string;

  @IsString()
  @MinLength(1)
  away_team: string;
}
