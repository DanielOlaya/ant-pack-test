import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  userId: string;

  @Prop()
  city?: string; 

  @Prop()
  coordinates?: string; 

  @Prop()
  metadata?: string; // This can be JSON stringified data
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);