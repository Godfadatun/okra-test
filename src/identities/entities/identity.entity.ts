// export class Identity {}
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Customer } from 'src/customers/entities/customer.entity';

export type IdentityDocument = Identity & Document;

@Schema({ timestamps: true })
export class Identity {
  @Prop()
  identity: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop()
  firstname: string;

  @Prop()
  middlename?: string;

  @Prop()
  lastname: string;

  @Prop()
  fullname: string;

  @Prop()
  dob: string;

  @Prop()
  address: string;

  @Prop()
  gender: string;

  @Prop()
  photo_id: string;

  @Prop()
  enrollment_date: string;

  @Prop()
  enrollment_bank: string;

  @Prop()
  phones: string[];

  @Prop()
  emails: string[];

  @Prop()
  bvn: string;

  @Prop()
  nin: string;

  @Prop()
  lga_origin: string;

  @Prop()
  lga_residence: string;

  @Prop()
  nationality: string;

  @Prop()
  state_residence: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  state_origin: {
    bank: string;
    registration_date: string;
  };

  @Prop()
  on_washlist: boolean;

  @Prop()
  marital_status: string;

  @Prop()
  account_level: string;

  @Prop()
  verification_country: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
