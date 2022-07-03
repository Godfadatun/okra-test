import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerControllerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  phone_number: string;
}

export class updateAccountDto {
  @IsNotEmpty()
  bank: string;

  @IsNotEmpty()
  nuban: string;
}
