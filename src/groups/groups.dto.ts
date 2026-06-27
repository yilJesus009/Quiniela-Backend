import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;
}

export class JoinGroupDto {
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  invite_code: string;
}
