import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, getAccountsFromBVNDto } from './dto/create-user.dto';
import { loginUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UtilsService } from 'src/utils/utils.service';
import { IdentitiesService } from 'src/identities/identities.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private auth: AuthService,
    private utils: UtilsService,
    private identity: IdentitiesService,
  ) {}

  async create(createUser: CreateUserDto) {
    const { email } = createUser;

    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    console.log({ user });
    if (user) throw new NotFoundException('User already exists');

    createUser.password = bcrypt.hashSync(createUser.password, 8);

    const createdUser = new this.userModel(createUser);
    return createdUser.save();
  }

  async findAll() {
    const users = await this.userModel
      .find()
      .select({
        firstName: 1,
        lastName: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        _id: 0,
      })
      .exec();

    return this.utils.sendObjectResponse('User Created', users);
  }

  async bvnIdentity(bvn: getAccountsFromBVNDto, userId: string) {
    // Identity Functions
    const { getAccountsFromBVN, confirmBVN, confirmNUBAN } = this.identity;
    try {
      const { data, status } = await getAccountsFromBVN(bvn);
      let nubanIdentities;
      let response;
      if (status === 'success') {
        const accounts = data.reponse;
        const { data: getNUBANDetails, status: getNUBANStatus } =
          await confirmNUBAN({
            nuban: accounts[0].account_no,
            bank: accounts[0].bank,
            bvn: String(bvn),
          });
        const { birthdate } = getNUBANDetails.response;
        nubanIdentities.dob = birthdate;
        nubanIdentities.status = getNUBANStatus;
      }
      if (nubanIdentities.status === 'success') {
        const { data: confirmBVNDetails } = await confirmBVN({
          dob: nubanIdentities.dob,
          bvn: String(bvn),
        });
        response = confirmBVNDetails.response;
      }

      const user = await this.userModel.findOne({ _id: userId }).exec();
      if (user) {
        // check if names match
        const aliases = [];
        if (user.firstName.toLowerCase() === response.FirstName.toLowerCase())
          aliases.push(user.firstName);
        if (user.lastName.toLowerCase() === response.LastName.toLowerCase())
          aliases.push(user.lastName);
      }

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
