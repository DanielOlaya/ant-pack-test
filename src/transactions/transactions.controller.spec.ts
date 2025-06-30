import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  beforeEach(async () => {
    const mockTransactionsService = {
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

  describe('getHistory', () => {
    it('should return all transactions', async () => {
      const transactions = [{ id: 1 }, { id: 2 }];
      (service.findAll as jest.Mock).mockResolvedValue(transactions);

      const result = await controller.getHistory();
      expect(result).toBe(transactions);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const dto = { userId: '1', city: 'Bogota' };
      const created = { id: 1, ...dto };
      (service.create as jest.Mock).mockResolvedValue(created);

      const result = await controller.create(dto as any);
      expect(result).toBe(created);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});