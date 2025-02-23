import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

import { UserRepository } from '../user/repositories/user.repository';
import { LoginDto } from './dtos/login.dto';
import { LoginVO } from './vo/login.vo';
import { validatePassword } from '../../utils/crypt.utils';
import { ROLL } from './helper/constants';
import { LoginResponseDto } from './dtos/login.response.dto';
import { TraceTemplate } from '../../core/template/trace.template';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { AUTH_TRACE } from './helper/trace.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly traceTemplate: TraceTemplate,
  ) {}

  @TraceExecution(AUTH_TRACE.LOGIN_USER_CONTROLLER)
  async login(dto: LoginDto) {
    const loginVO = new LoginVO(dto);
    const user = await this.userRepository.findByUserId(loginVO.userId);
    await validatePassword(loginVO.password, user.password);
    const accessToken = this.generateAccessToken(user.userId, ROLL.USER);
    return new LoginResponseDto(accessToken);
  }

  generateAccessToken(userId: string, roll: string): string {
    const payload = { userId: userId, roll: roll };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });
  }
}
