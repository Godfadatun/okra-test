import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET, MONGO_URL } from './config/env.config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './users/auth.service';
import { User, UserSchema } from './users/entities/user.entity';
import { UtilsModule } from './utils/utils.module';
import { UtilsService } from './utils/utils.service';
import { IdentitiesModule } from './identities/identities.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [
    // PassportModule,
    UsersModule,
    MongooseModule.forRoot(MONGO_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: {
        expiresIn: '1d', //30min
      },
    }),
    UtilsModule,
    IdentitiesModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, UtilsService],
})
export class AppModule {}
