import { PartialType } from '@nestjs/mapped-types';
import { confirmNUBANDto } from './create-identity.dto';

export class UpdateIdentityDto extends PartialType(confirmNUBANDto) {}
