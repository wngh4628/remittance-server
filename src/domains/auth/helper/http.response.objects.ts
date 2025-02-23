export interface HttpErrorFormat {
  stateCode: number;
  resultMsg: string;
}

export const REQUEST_SUCCESS_MESSAGE = {
  USER_LOGIN_SUCCESS: {
    stateCode: 200,
    resultMsg: 'OK',
  } as HttpErrorFormat,
};
