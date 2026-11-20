// Must load before any decorator runs: class-transformer reads design-time
// type metadata via Reflect.getMetadata when this module is evaluated.
import 'reflect-metadata';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsMongoId,
  IsPositive,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  categoryId!: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount!: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date!: Date;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  note?: string;
}
