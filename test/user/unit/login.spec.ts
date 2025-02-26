import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../../src/domains/auth/auth.controller';
import { AuthService } from '../../../src/domains/auth/auth.service';
import { LoginDto } from '../../../src/domains/auth/dtos/login.dto';
import { TraceTemplate } from '../../../src/core/template/trace.template';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn((dto: LoginDto) =>
      Promise.resolve({ token: 'mocked-jwt-token' }),
    ),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
 
  const mockTraceTemplate = {
    execute: jest.fn((message, callback) => callback()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: TraceTemplate, useValue: mockTraceTemplate },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return a JWT token on successful login', async () => {
    const loginDto: LoginDto = {
      userId: 'sample@gmail.com',
      password: 'Qq09iu!@1238798',
    };
    await authController.login(mockResponse, loginDto);

    expect(authService.login).toHaveBeenCalledWith(loginDto);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      resultCode: 200,
      resultMsg: 'OK',
      body: { token: 'mocked-jwt-token' },
    });
  });
});
