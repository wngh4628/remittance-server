export interface HttpErrorFormat {
  errorCode: string;
  description?: string;
  resultMsg: string;
}

export const HttpErrorConstants = {
  UNAUTHORIZED: {
    errorCode: 'UNAUTHORIZED',
    resultMsg: '로그인이 필요합니다.',
  } as HttpErrorFormat,

  FORBIDDEN: {
    errorCode: 'FORBIDDEN',
    resultMsg: '권한이 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    resultMsg: '알 수 없는 오류가 발생하였습니다.',
  } as HttpErrorFormat,

  EXIST_EMAIL: {
    errorCode: 'EXIST_EMAIL',
    resultMsg: '이미 가입된 이메일입니다.',
  } as HttpErrorFormat,

  INVALID_AUTH: {
    errorCode: 'UNAUTHORIZED',
    resultMsg: '이메일 또는 비밀번호가 올바르지 않습니다.',
  } as HttpErrorFormat,

  INVALID_TOKEN: {
    errorCode: 'UNAUTHORIZED',
    resultMsg: '잘못된 토큰값 입니다.',
  } as HttpErrorFormat,

  EXPIRED_ACCESS_TOKEN: {
    errorCode: 'EXPIRED_ACCESS_TOKEN',
    resultMsg: '액세스 토큰이 만료되었습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_USER: {
    errorCode: 'CANNOT_FIND_USER',
    resultMsg: '유저를 찾을 수 없습니다.',
  } as HttpErrorFormat,

  NOT_BE_EMPTY: 'not be empty',

  ERR_INVALID_PARAMS: '잘못된 파라미터 입니다.',
};
