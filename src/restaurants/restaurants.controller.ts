import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { GetRestaurantsDto } from './dto/get-restaurants.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('nearby')
  @UseGuards(JwtAuthGuard)
  async findNearby(
    @Query('city') city: string,
    @Query('lat') lat: string,
    @Query('lon') lon: string,
    @Req() req: any
  ) {
    try {
      return this.restaurantsService.findNearby({
        city,
        lat,
        lon,
        userId: req.user,
      });
    } catch (error) {
      throw error;
    }
  }
}
