import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AskAssistantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question!: string;
}
