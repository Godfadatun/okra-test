import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UtilsService } from 'src/utils/utils.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer, CustomerDocument } from './entities/customer.entity';
import * as randomstring from 'randomstring';
import { updateAccountDto, verifyCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private utils: UtilsService,
  ) {}
  async create(createCustomer: CreateCustomerDto) {
    try {
      const {
        email,
        user_id: user,
        phone_number,
        firstName,
        otherName,
        lastName,
      } = createCustomer;

      const customer = await this.customerModel
        .findOne({ email: email.toLowerCase(), user })
        .exec();
      if (customer) throw new NotFoundException('User already exists');

      const createdCustomer = new this.customerModel({
        code: `cus_${randomstring.generate({
          length: 6,
          capitalization: 'lowercase',
          charset: 'alphanumeric',
        })}`,
        email,
        firstName,
        lastName,
        full_name: `${firstName} ${lastName}`,
        user,
        ...(otherName && { otherName }),
        ...(phone_number && { phone_number }),
      });
      await createdCustomer.save();

      return this.utils.sendObjectResponse('customer created', {
        createdCustomer,
      });
    } catch (error) {
      console.log({ error });
      throw new NotFoundException(error.message, error.errors);
    }
  }

  async updateAccount(id: string, updateCustomer: updateAccountDto) {
    const { bank, nuban: account_no } = updateCustomer;
    const updatedCustomer = await this.customerModel
      .findOneAndUpdate(
        {
          code: id,
          'accounts.account_no': { $ne: account_no },
        },
        { $addToSet: { accounts: { account_no, bank } } },
      )
      .select({
        accounts: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      })
      .exec();
    if (!updatedCustomer) throw new NotFoundException('Account Already Exists');

    return this.utils.sendObjectResponse(
      'Customer account updated for this customer',
      { updatedCustomer },
    );
  }

  // async verifyCustomer(id: string, payload: verifyCustomerDto) {
  //   return `This action returns all customers`;
  // }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
