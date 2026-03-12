import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsMongoId,
} from "class-validator";
import { Type, Transform } from "class-transformer";

export class CreateTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  categoryId!: string;

  @Type(() => Number)
  @IsNumber()
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