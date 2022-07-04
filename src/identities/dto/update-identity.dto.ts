import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { confirmNUBANDto } from './create-identity.dto';

export class UpdateIdentityDto extends PartialType(confirmNUBANDto) {}

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
