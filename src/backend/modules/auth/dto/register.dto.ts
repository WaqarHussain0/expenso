// Must load before any decorator runs: class-transformer reads design-time
// type metadata via Reflect.getMetadata when this module is evaluated.
import 'reflect-metadata';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  email!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
