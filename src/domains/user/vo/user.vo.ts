import * as bcrypt from 'bcrypt';
import { encryptAES } from '../../../utils/crypt.utils';
import { IdType } from '../helper/constant';
import { CreateUserDto } from '../dtos/create.user.dto';

export class UserVO {
  userId: string;
  password: string;
  name: string;
  idType: IdType;
  idValue: string;

  // DTO를 직접 받도록 생성자 변경
  constructor(dto: CreateUserDto) {
    this.userId = dto.userId;
    this.password = this.hashPassword(dto.password);
    this.name = dto.name;
    this.idType = dto.idType;
    this.idValue = this.encryptIdValue(dto.idType, dto.idValue);
  }

  // 비밀번호 해싱
  private hashPassword(plainText: string): string {
    return bcrypt.hashSync(plainText, bcrypt.genSaltSync(10));
  }

  // 주민등록번호/사업자등록번호 암호화
  private encryptIdValue(idType: IdType, value: string): string {
    return encryptAES(value);
  }

  // Entity로 변환하는 메서드
  toEntity() {
    return {
      userId: this.userId,
      password: this.password,
      name: this.name,
      idType: this.idType,
      idValue: this.idValue,
    };
  }
}
