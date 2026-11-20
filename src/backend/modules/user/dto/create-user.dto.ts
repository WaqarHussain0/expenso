// Must load before any decorator runs: class-transformer reads design-time
// type metadata via Reflect.getMetadata when this module is evaluated.
import 'reflect-metadata';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRoleEnum } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string | null;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
