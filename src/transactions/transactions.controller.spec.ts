import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const mockTransactionsService = {
      findByUserId: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHistoryByUserId', () => {
    it('should return transactions for a user', async () => {
      const transactions = [{ id: 1 }, { id: 2 }];
      (service.findByUserId as jest.Mock).mockResolvedValue(transactions);

      const req = { user: { id: '1' } };
      const result = await controller.getHistoryByUserId(req);
      expect(result).toBe(transactions);
      expect(service.findByUserId).toHaveBeenCalledWith('1');
    });
  });
});