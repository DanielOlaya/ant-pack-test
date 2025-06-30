import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistoryByUserId(@Req() req: any) {
    return this.transactionsService.findByUserId(req.user.id);
  }
  
}
