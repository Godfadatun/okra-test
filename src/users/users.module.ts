import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../config/env.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UtilsService } from 'src/utils/utils.service';
import { IdentitiesService } from 'src/identities/identities.service';
import {
  Identity,
  IdentitySchema,
} from 'src/identities/entities/identity.entity';
import {
  Customer,
  CustomerSchema,
} from 'src/customers/entities/customer.entity';

@Module({
  imports: [
    // eslint-disable-next-line prettier/prettier
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Identity.name, schema: IdentitySchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '1d', //30min
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtStrategy,
    UtilsService,
    IdentitiesService,
  ],
})
export class UsersModule {}
