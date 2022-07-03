import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class loginUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
