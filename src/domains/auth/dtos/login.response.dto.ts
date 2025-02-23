export class LoginResponseDto {
  resultCode: number;
  resultMsg: string;
  token: string;

  constructor(token: string) {
    this.resultCode = 200;
    this.resultMsg = 'OK';
    this.token = token;
  }
}
