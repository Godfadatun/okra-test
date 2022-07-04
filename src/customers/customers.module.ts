import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { UtilsService } from 'src/utils/utils.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './entities/customer.entity';
import { IdentitiesService } from 'src/identities/identities.service';
import {
  Identity,
  IdentitySchema,
} from 'src/identities/entities/identity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Identity.name, schema: IdentitySchema },
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService, UtilsService, IdentitiesService],
})
export class CustomersModule {}
