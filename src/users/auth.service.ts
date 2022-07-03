import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { JWT_SECRET } from 'src/config/env.config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel
      .findOne({ email: username.toLowerCase() })
      .exec();
    if (!user) throw Error(`Your credentials are incorrect`);
    if (!bcrypt.compareSync(pass, user.password))
      throw new NotFoundException('Your credentials are incorrect');
    return user;
  }

  async generateAccessToken(
    user: CreateUserDto,
    payload?: any,
  ): Promise<string> {
    return this.jwtService.signAsync(
      { role: 'user', ...payload },
      {
        subject: String(user._id),
      },
    );
  }
}
