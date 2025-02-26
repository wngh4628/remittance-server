import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';

import { UserController } from '../../../src/domains/user/user.controller';
import { UserService } from '../../../src/domains/user/user.service';
import { CreateUserDto } from '../../../src/domains/user/dtos/create.user.dto';
import HttpResponse from '../../../src/core/http/http-response';
import { TraceTemplate } from '../../../src/core/template/trace.template';
import { REQUEST_SUCCESS_MESSAGE } from '../../../src/domains/user/helper/http.response.objects';


jest.mock('../../../src/core/http/http-response', () => ({
  default: {
    ok: jest.fn(),
  },
}));

describe('UserController - createUser', () => {
  let userController: UserController;
  let userService: UserService;
  let mockResponse: Partial<Response>;

  const mockUserService = {
    createUser: jest.fn().mockResolvedValue(true),
  };

  const mockTraceTemplate = {
    execute: jest.fn((message, callback) => callback()),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: TraceTemplate, useValue: mockTraceTemplate },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

    // ✅ `res` 객체의 `status`와 `json` 메서드 Mocking
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
  });

  it('회원가입 성공 시 HttpResponse.ok가 호출되어야 한다.', async () => {
    const createUserDto: CreateUserDto = {
      userId: 'sample@gmail.com',
      password: 'Qq09iu!@1238798',
      name: '테스',
      idType: 'REG_NO',
      idValue: '001123-3111111',
    };

    await userController.createUser(mockResponse as Response, createUserDto);

    expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    expect(HttpResponse.ok).toHaveBeenCalledWith(
      mockResponse,
      REQUEST_SUCCESS_MESSAGE.USER_REGISTERED_SUCCESS,
    );
  });
});
