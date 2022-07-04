import { Injectable, NotFoundException } from '@nestjs/common';
import {
  confirmBVNDto,
  confirmNUBANDto,
  getAccountsFromBVNDto,
} from './dto/create-identity.dto';
import {
  UpdateIdentityDto,
  verifyCustomerDto,
} from './dto/update-identity.dto';
import axios from 'axios';
import { ENVIRONMENT, OKRA_URL } from 'src/config/env.config';
import { UtilsService } from 'src/utils/utils.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';
import { Identity, IdentityDocument } from './entities/identity.entity';
import * as randomstring from 'randomstring';
import {
  Customer,
  CustomerDocument,
} from 'src/customers/entities/customer.entity';

@Injectable()
export class IdentitiesService {
  constructor(
    private utils: UtilsService,
    @InjectModel(Identity.name) private identityModel: Model<IdentityDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  private axiosInstance = axios.create({
    baseURL: OKRA_URL,
    headers: {},
  });

  async getAccountsFromBVN(bvn: string) {
    try {
      if (ENVIRONMENT === 'TEST') {
        return {
          status: 'success',
          message: 'Account(s) successfully retrieved',
          data: {
            response: [
              {
                account_no: 'xxxxxxxxxx',
                bank: 'xxxxx',
              },
              {
                account_no: 'xxxxxx',
                bank: 'xxxxxxx',
              },
            ],
          },
        };
      }

      const { data } = await this.axiosInstance.post('accounts-by-bvn', {
        bvn,
      });
      return data;
    } catch (error) {
      console.log({ error: error.response.data });
      throw new NotFoundException(
        error.response.data.message,
        error.response.data.data,
      );
    }
  }

  async confirmNUBAN(payload: confirmNUBANDto) {
    try {
      if (ENVIRONMENT === 'TEST') {
        return {
          status: 'success',
          message: 'NUBAN successfully confimed',
          data: {
            response: {
              birthdate: 'xxxxxxxxx',
              account_number: 'xxxxxxxx',
              bank: 'xxxxx',
              full_name: 'xxxxxxxxxx',
              email: 'xxxxxxxx',
              phone_number: 'xxxxxxxx',
              bvn: 'xxxxxxxx',
            },
          },
        };
      }
      const data = await this.axiosInstance.post('confirm-nuban', payload);
      return data;
    } catch (error) {
      console.log({ error: error.response.data });
      throw new NotFoundException(
        error.response.data.message,
        error.response.data.data,
      );
    }
  }

  async confirmBVN(payload: confirmBVNDto) {
    try {
      if (ENVIRONMENT === 'TEST') {
        return {
          status: 'success',
          message: 'BVN successfully confimed',
          data: {
            response: {
              FirstName: 'xxxxxx',
              MiddleName: 'xxxxxx',
              LastName: 'xxxxxx',
              DateOfBirth: 'xxxxxx',
              Address: 'xxxxxx',
              Gender: 'xxxxxx',
              PhotoId: 'xxxxxx',
              Enrollment_Date: 'xxxxxx',
              Enrollment_Bank: 'xxxxxx',
              Phone: 'xxxxxx',
              Email: 'xxxxxx',
              FullName: 'xxxxxx',
              Bvn: 'xxxxxx',
              Nin: 'xxxxxx',
              LGAOrigin: 'xxxxxx',
              LGAOfResidence: 'xxxxxx',
              nationality: 'xxxxxx',
              State_of_residence: 'xxxxxx',
              State_of_origin: 'xxxxxx',
              EnnrollmentBbank: 'xxxxxx',
              RegistrationDate: 'xxxxxx',
              Washlist: false,
              MaritalStatus: 'xxxxxx',
              AccountLevel: 'xxxxxx',
              VerificationCountry: 'xx',
            },
          },
        };
      }
      const data = await this.axiosInstance.post('confirm-bvn', payload);
      return data;
    } catch (error) {
      console.log({ error: error.response.data });
      throw new NotFoundException(
        error.response.data.message,
        error.response.data.data,
      );
    }
  }

  async checkIdentity(bvn: string) {
    try {
      const { data, status } = await this.getAccountsFromBVN(bvn);
      console.log({
        data: data.reponse,
        bvn
      });
      
      let nubanIdentities;
      let response;
      if (status === 'success') {
        const accounts = data.reponse;
        const { data: getNUBANDetails, status: getNUBANStatus } =
          await this.confirmNUBAN({
            nuban: accounts[0].account_no,
            bank: accounts[0].bank,
            bvn: String(bvn),
          });
        const { birthdate } = getNUBANDetails.response;
        nubanIdentities.dob = birthdate;
        nubanIdentities.status = getNUBANStatus;
      }
      if (nubanIdentities.status === 'success') {
        const { data: confirmBVNDetails } = await this.confirmBVN({
          dob: nubanIdentities.dob,
          bvn: String(bvn),
        });
        response = confirmBVNDetails.response;
      }

      return response;
    } catch (error) {
      console.log({ error: error.response });
      throw new NotFoundException(error.response.message, error.response);
    }
  }

  async verifyCustomerIdentity(id: string, payload: verifyCustomerDto) {
    try {
      const gottenIdentiy = await this.checkIdentity(payload.bvn);

      const identity = await this.identityModel
        .findOne({ bvn: payload.bvn })
        .exec();
      if (identity) throw new NotFoundException('This Identity already exists');

      const customer = await this.customerModel
        .findOne({ code: id })
        .select({ otherName: 1, code: 1 })
        .exec();
      if (!customer)
        throw new NotFoundException('This customer does not exists');

      const { Washlist: on_washlist, ...rest } = gottenIdentiy;
      const createdIdentity =
        ENVIRONMENT === 'TEST'
          ? new this.identityModel({
              identity: `idt_${randomstring.generate({
                length: 6,
                capitalization: 'lowercase',
                charset: 'alphanumeric',
              })}`,
              ...this.utils.toSnakeCase(rest),
              aliases: [customer.otherName.split(' ')],
              customer: customer.code,
              enrollment: {
                bank: gottenIdentiy.Enrollment_Bank,
                registration_date: gottenIdentiy.RegistrationDate,
              },
              on_washlist,
            })
          : new this.identityModel({
              identity: `idt_${randomstring.generate({
                length: 6,
                capitalization: 'lowercase',
                charset: 'alphanumeric',
              })}`,
              ...this.utils.toSnakeCase(rest),
              aliases: [customer.otherName.split(' ')],
              customer: customer.code,
              enrollment: {
                bank: gottenIdentiy.Enrollment_Bank,
                registration_date: gottenIdentiy.RegistrationDate,
              },
              on_washlist,
            });
      await createdIdentity.save();

      return this.utils.sendObjectResponse(
        'Identity successfully processed',
        'createdIdentity',
      );
    } catch (error) {
      console.log({ error });
      throw new NotFoundException(
        error.message || error.response.data.message,
        error.errors || error.response.data.data,
      );
    }
  }
}
