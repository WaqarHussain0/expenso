// Must load before any decorator runs: class-transformer reads design-time
// type metadata via Reflect.getMetadata when this module is evaluated.
import 'reflect-metadata';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserGenderEnum } from '../entities/user-profile.entity';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender?: UserGenderEnum;
}
