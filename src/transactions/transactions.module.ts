import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from 'src/schemas/transaction.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
      UsersModule,
      MongooseModule.forFeature([
        { name: 'Transaction', schema: TransactionSchema },
      ]),
    ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
