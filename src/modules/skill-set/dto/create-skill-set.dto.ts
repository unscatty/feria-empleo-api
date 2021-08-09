import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSkillSetDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
