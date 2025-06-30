import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUsersService = {
      findOne: jest.fn(),
      create: jest.fn(),
    };
    const mockJwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return user and token if credentials are valid', async () => {
      const user = { _id: '1', username: 'test', password: 'hashed' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('test', 'pass');
      expect(result).toHaveProperty('access_token', 'signed-token');
      expect(result).toHaveProperty('username', 'test');
      expect(usersService.findOne).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('pass', 'hashed');
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.login('test', 'wrong')).rejects.toThrow();
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      const user = { _id: '1', username: 'test', password: 'hashed' };
      (usersService.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('test', 'wrong')).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should hash password and call usersService.create', async () => {
      const user = { username: 'test', password: 'pass' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (usersService.create as jest.Mock).mockResolvedValue({ response: 'user created successfully' });

      const result = await service.register(user as any);
      expect(usersService.create).toHaveBeenCalledWith({ ...user, password: 'hashed' });
      expect(result).toEqual({ response: 'user created successfully' });
    });
  });
});