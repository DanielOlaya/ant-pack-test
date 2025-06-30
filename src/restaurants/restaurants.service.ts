import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionsService } from 'src/transactions/transactions.service';
import { GetRestaurantsDto } from './dto/get-restaurants.dto';
import { fetchGet } from 'src/utils/fetch.util';

@Injectable()
export class RestaurantsService {
  constructor(private readonly transactionsService: TransactionsService) {}

  async findNearby(locationData: GetRestaurantsDto): Promise<any> {
    const { userId, city, lat, lon } = locationData;
    let url = "https://api.yelp.com/v3/businesses/search?categories=restaurants&limit=10";
    if (!city && (!lat && !lon)) {
      throw new BadRequestException('City or coordinates are required');
    }
    if (lat && lon) {
      url += `&latitude=${Number(lat)}&longitude=${Number(lon)}&radius=10000`;
    } else if (city) {
      url += `&location=${city}`;
    }
    const apiKey = process.env.YELP_API_KEY;
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      accept: 'application/json',
    };
    try {
      const { businesses } = await fetchGet<{ businesses: any[] }>(url, headers);
      if (businesses?.length) {
        this.transactionsService.create({ userId, city, coordinates: `${lat || ''}, ${lon || ''}`, metadata: businesses });
      }
      return businesses || [];
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to fetch restaurants');
    }
  }
}
