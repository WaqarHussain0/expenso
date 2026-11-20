// Must load before any decorator runs: class-transformer reads design-time
// type metadata via Reflect.getMetadata when this module is evaluated.
import 'reflect-metadata';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AskAssistantDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  question!: string;
}
