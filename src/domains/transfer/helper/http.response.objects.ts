export interface HttpErrorFormat {
  stateCode: number;
  resultMsg: string;
}

export const REQUEST_SUCCESS_MESSAGE = {
  REQUEST_TRANSFER_SUCCESS: {
    stateCode: 200,
    resultMsg: 'OK',
  } as HttpErrorFormat,
};
