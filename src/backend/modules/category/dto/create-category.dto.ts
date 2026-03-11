import { IsNotEmpty, IsOptional, IsString, IsEnum } from "class-validator";
import { Transform } from "class-transformer";
import { CategoryTypeEnum } from "../entities/category.entity";

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  name!: string;

  @IsOptional()
  @IsEnum(CategoryTypeEnum)
  type?: CategoryTypeEnum;
}
