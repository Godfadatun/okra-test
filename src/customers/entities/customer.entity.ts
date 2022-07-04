import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/users/entities/user.entity';

export type CustomerDocument = Customer & Document;
export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop()
  account_no: string;

  @Prop()
  bank: string;
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  otherName: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone_number: string;

  @Prop([Account])
  accounts: Account[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const AccountSchema = SchemaFactory.createForClass(Account);
