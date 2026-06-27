import { IsString, IsDateString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateMatchDto {
  @IsString() home_team: string;
  @IsString() away_team: string;
  @IsDateString() match_date: string;

  @IsString()
  @IsIn(['group', 'round_of_32', 'round_of_16', 'quarter', 'semi', 'third_place', 'final'])
  phase: string;

  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsInt()    stadium_id?: number;
  @IsOptional() @IsString() external_id?: string;
}

export class UpdateMatchDto {
  @IsOptional() @IsString() home_team?: string;
  @IsOptional() @IsString() away_team?: string;
  @IsOptional() @IsDateString() match_date?: string;
  @IsOptional() @IsString() phase?: string;
  @IsOptional() @IsString() group_name?: string;
  @IsOptional() @IsInt()    stadium_id?: number;
  @IsOptional() @IsString()
  @IsIn(['scheduled', 'live', 'finished'])
  status?: string;
  @IsOptional() @IsString() external_id?: string;
}
