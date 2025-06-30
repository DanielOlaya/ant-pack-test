import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {

  async findNearby(city: string) {
    try {
      const apiKey = process.env.YELP_API_KEY;
      const response = await fetch('https://api.yelp.com/v3/businesses/search', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          location: city,
          categories: 'restaurants',
          limit: 10,
        }),
      });
      return response.json();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching restaurants');
    }
  }

  // create(createRestaurantDto: CreateRestaurantDto) {
  //   return 'This action adds a new restaurant';
  // }

  // findAll() {
  //   return `This action returns all restaurants`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} restaurant`;
  // }

  // update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
  //   return `This action updates a #${id} restaurant`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} restaurant`;
  // }
}
