import {
  IsString,
  IsDateString,
  IsOptional,
  IsInt,
  IsIn,
} from 'class-validator';
import type { MatchPhase, MatchStatus } from '../matches/match.entity';

const MATCH_PHASES: MatchPhase[] = [
  'group',
  'round_of_32',
  'round_of_16',
  'quarter',
  'semi',
  'third_place',
  'final',
];

const MATCH_STATUSES: MatchStatus[] = ['scheduled', 'live', 'finished'];

export class CreateMatchDto {
  @IsString() home_team: string;
  @IsString() away_team: string;
  @IsDateString() match_date: string;

  @IsString()
  @IsIn(MATCH_PHASES)
  phase: MatchPhase;

  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsInt() stadium_id?: number;
  @IsOptional() @IsString() external_id?: string;
}

export class UpdateMatchDto {
  @IsOptional() @IsString() home_team?: string;
  @IsOptional() @IsString() away_team?: string;
  @IsOptional() @IsDateString() match_date?: string;
  @IsOptional() @IsString() @IsIn(MATCH_PHASES) phase?: MatchPhase;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsInt() stadium_id?: number;
  @IsOptional()
  @IsString()
  @IsIn(MATCH_STATUSES)
  status?: MatchStatus;
  @IsOptional() @IsString() external_id?: string;
}
