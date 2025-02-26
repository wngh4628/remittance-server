import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HttpErrorConstants } from '../core/http/http-error-objects';

export const hashPassword = (plainText: string): string => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainText, salt);
  } catch (error) {
    console.error('비밀번호 암호화 중 오류 발생:', error);
    throw new Error('비밀번호 암호화에 실패했습니다.');
  }
};

// 패스워드 검증
export const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<void> => {
  const equalsPassword = await comparePassword(password, hashedPassword);

  if (!equalsPassword) {
    throw new UnauthorizedException(HttpErrorConstants.INVALID_AUTH);
  }
};

// 사용자가 입력한 비밀번호와 저장되어있는 비밀번호 비교
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * 비밀번호 정책 정규식
 *  - 영문, 숫자, 특수문자 조합 8자 이상
 *  - 최대 64자인데 UI에는 표기하지 않음
 *  ex) qwer123#
 */
export const PasswordRegex =
  /^(?=.*[a-zA-Z])(?=.*[!@#$^*+=-])(?=.*[0-9]).{8,64}$/;

import * as crypto from 'crypto';

// AES-256-CBC 암호화 함수
export function encryptAES(text: string): string {
  // 환경변수에서 AES 키 & IV 가져오기
  const AES_KEY = process.env.AES_KEY || process.env.AES_KEY_SECONDARY;
  const AES_IV = process.env.AES_IV || process.env.AES_IV_SECONDARY;

  // AES_KEY & AES_IV를 Buffer로 변환 (올바른 hex 변환)
  const keyBuffer = Buffer.from(AES_KEY, 'hex');
  const ivBuffer = Buffer.from(AES_IV, 'hex'); 

  // 암호화 수행
  const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, ivBuffer);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// AES-256-CBC 복호화 함수
export function decryptAES(encryptedText: string): string {
  // 환경 변수에서 AES 키 & IV 가져오기
  const AES_KEY = process.env.AES_KEY || process.env.AES_KEY_SECONDARY;
  const AES_IV = process.env.AES_IV || process.env.AES_IV_SECONDARY;
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(AES_KEY),
    AES_IV,
  );
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
