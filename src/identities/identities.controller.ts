import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import {
  confirmNUBANDto,
  getAccountsFromBVNDto,
} from './dto/create-identity.dto';
import {
  UpdateIdentityDto,
  verifyCustomerControllerDto,
} from './dto/update-identity.dto';
import { PrincipalGuard } from 'src/users/guards/principal.guard';

@Controller('identities')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @UseGuards(PrincipalGuard)
  @Post('bvn-accounts')
  @UsePipes(new ValidationPipe())
  create(@Body() getAccountsFromBVN: getAccountsFromBVNDto) {
    return this.identitiesService.getAccountsFromBVN(
      String(getAccountsFromBVN),
    );
  }

  // @UseGuards(PrincipalGuard)
  @Post('nuban-confirmation')
  @UsePipes(new ValidationPipe())
  findAll(@Body() confirmNUBAN: confirmNUBANDto) {
    console.log({ confirmNUBAN });
    return this.identitiesService.confirmNUBAN(confirmNUBAN);
  }

  @UseGuards(PrincipalGuard)
  @Post('process')
  @UsePipes(new ValidationPipe())
  verify(
    @Param('id') id: string,
    @Body() verify: verifyCustomerControllerDto,
    @Request() req,
  ) {
    const payload = { ...verify, user_id: req.user.userId };
    return this.identitiesService.verifyCustomerIdentity(id, payload);
  }
}
