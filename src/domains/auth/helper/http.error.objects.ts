import { HttpErrorFormat } from '../../../core/http/http-error-objects';

export const HttpErrorConstants = {
  USER_LOGIN_FAIL: {
    errorCode: 'USER_LOGIN_FAIL',
    resultMsg: '로그인에 실패했습니다. 다시 시도해주세요.',
  } as HttpErrorFormat,

  AUTH_TOKEN_INVALID: {
    errorCode: 'AUTH_TOKEN_INVALID',
    resultMsg: '사용할 수 없는 토큰입니다.',
  } as HttpErrorFormat,

};
