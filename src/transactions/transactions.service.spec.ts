import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let transactionModel: any;

  beforeEach(async () => {
    transactionModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      save: jest.fn(),
      sort: jest.fn(),
      exec: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken('Transaction'), useValue: transactionModel },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const execMock = jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);
      transactionModel.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: execMock }) });

      const result = await service.findAll();
      expect(result).toEqual([{ id: 1 }, { id: 2 }]);
      expect(transactionModel.find).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return transactions by userId', async () => {
      const execMock = jest.fn().mockResolvedValue([{ id: 1, userId: '1' }]);
      transactionModel.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: execMock }) });

      const result = await service.findByUserId('1');
      expect(result).toEqual([{ id: 1, userId: '1' }]);
      expect(transactionModel.find).toHaveBeenCalledWith({ userId: '1' });
    });
  });

  describe('create', () => {
    it('should create a transaction and return it', async () => {
      const saveMock = jest.fn().mockResolvedValue({ id: 1, userId: '1' });
      function MockTransaction(data: any) {
        return { ...data, save: saveMock };
      }
      (service as any).transactionModel = MockTransaction as any;

      const dto = { userId: '1', metadata: { foo: 'bar' } };
      const result = await service.create(dto as any);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, userId: '1' });
    });

    it('should throw InternalServerErrorException on error', async () => {
      function MockTransaction() {
        return { save: jest.fn().mockRejectedValue(new Error('fail')) };
      }
      (service as any).transactionModel = MockTransaction as any;

      await expect(service.create({ userId: '1', metadata: {} } as any)).rejects.toThrow();
    });
  });
});