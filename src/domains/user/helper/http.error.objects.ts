import { HttpErrorFormat } from '../../../core/http/http-error-objects';

export const HttpErrorConstants = {
  USER_REGISTERED_FAIL: {
    errorCode: 'USER_REGISTERED_FAIL',
    message: '회원 가입에 실패했습니다. 다시 시도해주세요.',
  } as HttpErrorFormat,

  DUPLICATE_USER_ID: {
    errorCode: 'DUPLICATE_USER_ID',
    message: '이미 사용 중인 이메일입니다. 다른 이메일을 입력해주세요.',
  } as HttpErrorFormat,
};
