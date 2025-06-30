import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ username: 'test', access_token: 'token' }),
            register: jest.fn().mockResolvedValue({ response: 'user created successfully' }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login a user', async () => {
    const body = { username: 'test', password: 'pass' };
    const result = await controller.login(body);
    expect(result).toEqual({ username: 'test', access_token: 'token' });
    expect(service.login).toHaveBeenCalledWith('test', 'pass');
  });

  it('should register a user', async () => {
    const body = { username: 'test', password: 'pass' };
    const result = await controller.register(body);
    expect(result).toEqual({ response: 'user created successfully' });
    expect(service.register).toHaveBeenCalledWith(body);
  });

  it('should return user profile', () => {
    const req = { user: { username: 'test' } };
    expect(controller.getProfile(req)).toEqual({ username: 'test' });
  });
});
