import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PrincipalGuard } from 'src/users/guards/principal.guard';
import { CustomersService } from './customers.service';
import {
  CreateCustomerControllerDto,
  updateAccountDto,
} from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(PrincipalGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  createCustomer(
    @Body() createCustomer: CreateCustomerControllerDto,
    @Request() req,
  ) {
    const payload = { ...createCustomer, user_id: req.user.userId };
    return this.customersService.create(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @UseGuards(PrincipalGuard)
  @Patch('addAccount/:id')
  @UsePipes(new ValidationPipe())
  addAccount(
    @Param('id') id: string,
    @Body() updateCustomerDto: updateAccountDto,
  ) {
    return this.customersService.updateAccount(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
