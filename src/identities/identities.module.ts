import { Module } from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import { IdentitiesController } from './identities.controller';
import { UtilsService } from 'src/utils/utils.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [IdentitiesController],
  providers: [IdentitiesService, UtilsService],
})
export class IdentitiesModule {}
