import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { TransactionsService } from 'src/transactions/transactions.service';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let transactionsService: TransactionsService;

  beforeEach(async () => {
    const mockTransactionsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    transactionsService = module.get<TransactionsService>(TransactionsService);

    // Mock global fetch
    global.fetch = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findNearby', () => {
    it('should throw BadRequestException if no city or coordinates are provided', async () => {
      await expect(
        service.findNearby({ userId: '1', city: '', lat: '', lon: '' })
      ).rejects.toThrow('City or coordinates are required');
    });

    it('should call transactionsService.create if businesses are found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          businesses: [{ name: 'Test Restaurant' }],
        }),
      });

      const params = { userId: '1', city: 'Bogota', lat: '', lon: '' };
      await service.findNearby(params);

      expect(transactionsService.create).toHaveBeenCalledWith({
        userId: '1',
        city: 'Bogota',
        coordinates: ', ',
        metadata: [{ name: 'Test Restaurant' }],
      });
    });

    it('should return businesses if found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          businesses: [{ name: 'Test Restaurant' }],
        }),
      });

      const params = { userId: '1', city: 'Bogota', lat: '', lon: '' };
      const result = await service.findNearby(params);

      expect(result).toEqual([{ name: 'Test Restaurant' }]);
    });

    it('should return empty array if no businesses found', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          businesses: [],
        }),
      });

      const params = { userId: '1', city: 'Bogota', lat: '', lon: '' };
      const result = await service.findNearby(params);

      expect(result).toEqual([]);
    });
  });
});