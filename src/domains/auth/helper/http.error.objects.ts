import { HttpErrorFormat } from '../../../core/http/http-error-objects';

export const HttpErrorConstants = {
  USER_LOGIN_FAIL: {
    errorCode: 'USER_LOGIN_FAIL',
    message: '로그인에 실패했습니다. 다시 시도해주세요.',
  } as HttpErrorFormat,
};
