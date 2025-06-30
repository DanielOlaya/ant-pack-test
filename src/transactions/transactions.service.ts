import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<Transaction>,
  ) {}
  
  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    try {
      const objectId = new Types.ObjectId(userId);
      return this.transactionModel.find({ userId: objectId }).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new NotFoundException('No transactions found for this user');
    }
  }

  async create(createTransactionData: CreateTransactionDto): Promise<Transaction> {
    try {
      createTransactionData.metadata = JSON.stringify(createTransactionData.metadata);
      const newTransaction = new this.transactionModel(createTransactionData);
      return newTransaction.save();
    } catch (error) {
      throw new InternalServerErrorException('Error creating transaction');
    }
  }
}
