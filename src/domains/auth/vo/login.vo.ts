import { LoginDto } from '../dtos/login.dto';

export class LoginVO {
  userId: string;
  password: string;

  // DTO를 직접 받도록 생성자 변경
  constructor(dto: LoginDto) {
    this.userId = dto.userId;
    this.password = dto.password;
  }
}
