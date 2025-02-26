import { Test, TestingModule } from '@nestjs/testing';
import { TraceTemplate } from '../../src/core/template/trace.template';
import { CreateQuoteDto } from '../../src/domains/transfer/dtos/\bcreate.quote.dto';
import { TransferController } from '../../src/domains/transfer/transfer.controller';
import { TransferService } from '../../src/domains/transfer/transfer.service';
import { User } from '../../src/domains/user/entities/user.entity';
import { SaveOptions } from 'typeorm';

describe('TransferController - getTransferQuote', () => {
  let transferController: TransferController;
  let transferService: TransferService;

  const mockTransferService = {
    getTransferQuote: jest.fn((dto: CreateQuoteDto, user: User) => {
      if (dto.amount < 0) {
        throw new Error('송금액은 음수가 될 수 없습니다.');
      }
      return Promise.resolve({
        quoteId: '1',
        exchangeRate: 9.013,
        expireTime: '2024-02-16 08:21:09',
        targetAmount: 630.91,
      });
    }),
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
      controllers: [TransferController],
      providers: [
        { provide: TransferService, useValue: mockTransferService },
        { provide: TraceTemplate, useValue: mockTraceTemplate },
      ],
    }).compile();

    transferController = module.get<TransferController>(TransferController);
    transferService = module.get<TransferService>(TransferService);
  });

  it('should be defined', () => {
    expect(transferController).toBeDefined();
  });

  it('should return a transfer quote on success (200 OK)', async () => {
    const dto: CreateQuoteDto = {
      amount: 10000,
      targetCurrency: 'JPY',
    };

    const mockUser: User = {
      idx: 1,
      userId: 'test@example.com',
      password: 'securepassword',
      name: 'Test User',
      idType: 'REG_NO',
      createdAt: new Date(),
      updatedAt: new Date(),
      idValue: null, // idValue 추가
      deletedAt: null, // deletedAt 추가
      hasId: jest.fn(() => true), // hasId 추가 (예시로 true 설정)
      save: jest.fn(), // save 메서드 모킹
      remove: jest.fn(), // remove 메서드 모킹
      softRemove: jest.fn(),
      recover: function (options?: SaveOptions): Promise<User> {
        throw new Error('Function not implemented.');
      },
      reload: function (): Promise<void> {
        throw new Error('Function not implemented.');
      },
    };

    const mockRequest = {
      headers: {
        authorization: 'Bearer valid-token', // valid token for testing
      },
    };

    await transferController.getTransferQuote(
      mockResponse,
      dto,
      mockRequest.headers.authorization,
    );

    expect(transferService.getTransferQuote).toHaveBeenCalledWith(
      dto,
      mockUser.idx,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      resultCode: 200,
      resultMsg: 'OK',
      quote: expect.any(Object),
    });
  });

  it('should return 400 Bad Request if amount is negative', async () => {
    const dto: CreateQuoteDto = {
      amount: -100,
      targetCurrency: 'JPY',
    };

    try {
      await transferController.getTransferQuote(mockResponse, dto, null);
    } catch (error) {
      expect(error.message).toBe('송금액은 음수가 될 수 없습니다.');
    }
  });

//   it('should return 401 Unauthorized if no valid token is provided', async () => {
//     const dto: CreateQuoteDto = {
//       amount: 10000,
//       targetCurrency: 'JPY',
//     };

//     // Test for invalid token
//     const mockRequestInvalidToken = {
//       headers: {
//         authorization: 'Bearer invalid-token', // Invalid token
//       },
//     };

//     await transferController.getTransferQuote(
//       mockResponse,
//       dto,
//       mockRequestInvalidToken.headers.authorization,
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(401);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       resultCode: 401,
//       resultMsg: '사용할 수 없는 토큰입니다.',
//     });

//     // Test for no token
//     const mockRequestNoToken = {
//       headers: {
//         authorization: '', // Empty token
//       },
//     };

//     await transferController.getTransferQuote(
//       mockResponse,
//       dto,
//       mockRequestNoToken.headers.authorization,
//     );

//     expect(mockResponse.status).toHaveBeenCalledWith(401);
//     expect(mockResponse.json).toHaveBeenCalledWith({
//       resultCode: 401,
//       resultMsg: '사용할 수 없는 토큰입니다.',
//     });
//   });

  it('should return 500 Internal Server Error on unexpected error', async () => {
    mockTransferService.getTransferQuote.mockImplementation(() => {
      throw new Error('알 수 없는 에러 입니다.');
    });

    const dto: CreateQuoteDto = {
      amount: 10000,
      targetCurrency: 'JPY',
    };

    try {
      await transferController.getTransferQuote(mockResponse, dto, null);
    } catch (error) {
      expect(error.message).toBe('알 수 없는 에러 입니다.');
    }
  });
});
