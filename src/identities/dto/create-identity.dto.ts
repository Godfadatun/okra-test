import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class confirmNUBANDto {
  @IsNotEmpty()
  @IsString()
  nuban: string;

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  bvn: string;
}

export class getAccountsFromBVNDto {
  @IsNotEmpty()
  @IsString()
  bvn: string;
}

export class confirmBVNDto {
  @IsNotEmpty()
  @IsString()
  @IsDate()
  dob: string;

  @IsNotEmpty()
  @IsString()
  bvn: string;
}
