import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { CategoryTypeEnum } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name!: string;

  @IsString()
  @IsNotEmpty()
  color!: string;

  @IsString()
  @IsNotEmpty()
  icon!: string;

  @IsNotEmpty()
  @IsEnum(CategoryTypeEnum)
  type!: CategoryTypeEnum;
}
