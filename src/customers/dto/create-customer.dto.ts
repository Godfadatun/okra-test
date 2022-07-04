import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  otherName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  phone_number: string;
}
