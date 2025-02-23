import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(64)
  @IsEmail()
  userId: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
