import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserGenderEnum } from '../entities/user-profile.entity';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  contact?: string | null;

  @IsOptional()
  @IsEnum(UserGenderEnum)
  gender?: UserGenderEnum;
}
