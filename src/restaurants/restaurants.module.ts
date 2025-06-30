import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [UsersModule, TransactionsModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, JwtAuthGuard],
})
export class RestaurantsModule {}
