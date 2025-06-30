import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;
  let service: RestaurantsService;

  beforeEach(async () => {
    const mockRestaurantsService = {
      findNearby: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
      providers: [
        { provide: RestaurantsService, useValue: mockRestaurantsService },
      ],
    }).compile();

    controller = module.get<RestaurantsController>(RestaurantsController);
    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findNearby', () => {
    it('should call restaurantsService.findNearby with correct params', async () => {
      const req = { user: 'userId123' };
      const query = { city: 'Bogota', lat: '4.6', lon: '-74.1' };
      const expectedResult = [{ name: 'Test Restaurant' }];
      (service.findNearby as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.findNearby(query.city, query.lat, query.lon, req);

      expect(service.findNearby).toHaveBeenCalledWith({
        city: 'Bogota',
        lat: '4.6',
        lon: '-74.1',
        userId: 'userId123',
      });
      expect(result).toBe(expectedResult);
    });
  });
});