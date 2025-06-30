import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { GetRestaurantsDto } from './dto/get-restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async findNearby(locationData: GetRestaurantsDto): Promise<any> {
    const { userId, city, lat, lon } = locationData;
    try {
      let URL = "https://api.yelp.com/v3/businesses/search?categories=restaurants&limit=10";
      if (!city && (!lat && !lon)) {
        throw new BadRequestException('City or coordinates are required');
      }
      if (lat && lon) {
        URL += `&latitude=${Number(lat)}&longitude=${Number(lon)}&radius=10000`;
      } else if (city) {
        URL += `&location=${city}`;
      }
      console.log(URL)
      const apiKey = process.env.YELP_API_KEY;
      const response = await fetch(`${URL}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          accept: 'application/json',
        },
      });
      const { businesses } = await response.json();
      if (businesses && businesses.length >= 1) {
        this.transactionsService.create({ userId, city, coordinates: `${lat || ''}, ${lon || ''}`, metadata: businesses });
      }
      return businesses;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }

}
