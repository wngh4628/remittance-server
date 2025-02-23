import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { PasswordRegex } from '../../../utils/crypt.utils';
import { IdType } from '../helper/constant';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message:
      '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  name: string;

  @IsNotEmpty()
  idType: IdType;

  @IsNotEmpty()
  idValue: string;
}
