import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './users/dto/create-user.dto';
import { loginUserDto } from './users/dto/update-user.dto';
import { User, UserDocument } from './users/entities/user.entity';
import { AuthService } from './users/auth.service';
import * as bcrypt from 'bcrypt';
import { UtilsService } from './utils/utils.service';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private auth: AuthService,
    private utils: UtilsService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async register(createUser: CreateUserDto) {
    const { email } = createUser;

    const user = await this.userModel
      .findOne({ email: email.toLowerCase() })
      .exec();
    if (user) throw new NotFoundException('User already exists');

    createUser.password = bcrypt.hashSync(createUser.password, 8);

    const createdUser = new this.userModel(createUser);
    createdUser.save();
    const token = await this.auth.generateAccessToken(createdUser);
    const { _id, email: userEmail, firstName, lastName } = createdUser;

    return this.utils.sendObjectResponse('User Created', {
      user: { _id, userEmail, firstName, lastName },
      token,
    });
  }

  async login(loginUser: loginUserDto) {
    const { email, password } = loginUser;
    const user = await this.auth.validateUser(email, password);

    const token = await this.auth.generateAccessToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, email: userEmail, firstName, lastName } = user;
    return this.utils.sendObjectResponse('User Logged in', {
      user,
      token,
    });
  }
}
