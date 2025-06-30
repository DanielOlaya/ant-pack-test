import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: any;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken('User'), useValue: userModel },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { toObject: () => ({ username: 'test' }) };
      userModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(user) });
      const result = await service.findOne('test');
      expect(result).toEqual({ username: 'test' });
    });

    it('should return undefined if user not found', async () => {
      userModel.findOne.mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
      const result = await service.findOne('notfound');
      expect(result).toBeUndefined();
    });
  });

  describe('create', () => {
    it('should create a user and return success message', async () => {
      const saveMock = jest.fn().mockResolvedValue({});
      (service as any).userModel = function (data: any) {
        return { save: saveMock };
      };

      const dto = { username: 'test', password: 'pass' };
      const result = await service.create(dto as any);
      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ response: 'user created successfully' });
    });
  });
});