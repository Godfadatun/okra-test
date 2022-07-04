import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerControllerDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  otherName: string;

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

export class verifyCustomerControllerDto {
  @IsNotEmpty()
  bvn: string;
}

export class verifyCustomerDto {
  @IsNotEmpty()
  bvn: string;

  @IsNotEmpty()
  user_id: string;
}
