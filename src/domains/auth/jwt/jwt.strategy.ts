import { UserRepository } from '../../user/repositories/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { HttpErrorConstants } from '../../../core/http/http-error-objects';
import { ROLL } from '../helper/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더로부터 토큰 추출하는 함수. Bearer 타입 사용
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.userId) {
      throw new UnauthorizedException(HttpErrorConstants.CANNOT_FIND_USER);
    }

    const roll = payload.roll; // 일반 사용자 or 백오피스 어드민

    if (roll === ROLL.USER) {
      const user = await this.userRepository.findOne({
        where: {
          userId: payload.userId,
        },
      });

      if (!user) {
        throw new UnauthorizedException(HttpErrorConstants.CANNOT_FIND_USER);
      }
      return user;
    }
  }
}
