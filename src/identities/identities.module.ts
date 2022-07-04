import { Identity, IdentitySchema } from './entities/identity.entity';
import { Module } from '@nestjs/common';
import { IdentitiesService } from './identities.service';
import { IdentitiesController } from './identities.controller';
import { UtilsService } from 'src/utils/utils.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Customer,
  CustomerSchema,
} from '../customers/entities/customer.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Identity.name, schema: IdentitySchema },
    ]),
  ],
  controllers: [IdentitiesController],
  providers: [IdentitiesService, UtilsService],
})
export class IdentitiesModule {}
