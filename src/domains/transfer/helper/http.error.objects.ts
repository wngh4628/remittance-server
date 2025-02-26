import { HttpErrorFormat } from '../../../core/http/http-error-objects';

export const HttpErrorConstants = {
  NEGATIVE_NUMBER: {
    errorCode: 'NEGATIVE_NUMBER',
    message: '송금액은 음수가 될 수 없습니다.',
  },

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    resultMsg: '알 수 없는 에러 입니다.',
  } as HttpErrorFormat,

  LIMIT_EXCESS: {
    errorCode: 'LIMIT_EXCESS',
    resultMsg: '오늘 송금 한도 초과 입니다.',
  } as HttpErrorFormat,
};
