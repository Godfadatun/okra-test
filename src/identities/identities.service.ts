import { Injectable, NotFoundException } from '@nestjs/common';
import {
  confirmBVNDto,
  confirmNUBANDto,
  getAccountsFromBVNDto,
} from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import axios from 'axios';
import { OKRA_URL } from 'src/config/env.config';
import { UtilsService } from 'src/utils/utils.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/entities/user.entity';

@Injectable()
export class IdentitiesService {
  constructor(
    private utils: UtilsService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  private axiosInstance = axios.create({
    baseURL: OKRA_URL,
    headers: {},
  });

  async getAccountsFromBVN(bvn: getAccountsFromBVNDto) {
    try {
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

  async bvnIdentity(bvn: getAccountsFromBVNDto, userId: string) {
    try {
      const { data, status } = await this.getAccountsFromBVN(bvn);
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

      // const user = await this.userModel.findOne({ _id: userId }).exec();
      // if (user) {
      //   // check if names match
      //   const aliases = [];
      //   if (user.firstName.toLowerCase() === response.FirstName.toLowerCase())
      //     aliases.push(user.firstName);
      //   if (user.lastName.toLowerCase() === response.LastName.toLowerCase())
      //     aliases.push(user.lastName);
      // }

      return this.utils.sendObjectResponse(
        'Identity successfully processed',
        response,
      );
    } catch (error) {
      console.log({ error: error.response.data });
      throw new NotFoundException(
        error.response.data.message,
        error.response.data.data,
      );
    }
  }
}
