import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearby')
  async findNearby(@Query('city') city: string) {
    try {
      return this.restaurantsService.findNearby(city);
    } catch (error) {
      throw error;
    }
  }
}
