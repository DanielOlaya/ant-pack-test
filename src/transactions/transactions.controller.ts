import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('history')
  async getHistory() {
    try {
      return this.transactionsService.findAll();
    } catch (error) {
      throw error;
    }
  }
  
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    try {
      return this.transactionsService.create(createTransactionDto);
    } catch (error) {
      throw error;
    }
  }
  
}
