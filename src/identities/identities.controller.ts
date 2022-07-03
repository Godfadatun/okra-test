import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import {
  confirmNUBANDto,
  getAccountsFromBVNDto,
} from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { PrincipalGuard } from 'src/users/guards/principal.guard';

@Controller('identities')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @UseGuards(PrincipalGuard)
  @Post('bvn-accounts')
  create(@Body() getAccountsFromBVN: getAccountsFromBVNDto) {
    return this.identitiesService.getAccountsFromBVN(getAccountsFromBVN);
  }

  // @UseGuards(PrincipalGuard)
  @Post('nuban-confirmation')
  findAll(@Body() confirmNUBAN: confirmNUBANDto) {
    console.log({ confirmNUBAN });
    return this.identitiesService.confirmNUBAN(confirmNUBAN);
  }
}
