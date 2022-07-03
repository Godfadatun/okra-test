import { IsOptional } from 'class-validator';
// import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  _id: string;
}

export class getAccountsFromBVNDto {
  @IsNotEmpty()
  @IsString()
  bvn: string;
}
