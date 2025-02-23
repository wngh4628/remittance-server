import { HttpErrorFormat } from '../../../core/http/http-error-objects';

export const HttpErrorConstants = {
  NEGATIVE_NUMBER: {
    errorCode: 'NEGATIVE_NUMBER',
    message: '송금액은 음수가 될 수 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: '알 수 없는 에러 입니다.',
  } as HttpErrorFormat,
};
