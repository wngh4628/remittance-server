import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../../domains/user/entities/user.entity';
import { HttpErrorConstants } from '../helper/http.error.objects';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // 부모 클래스의 canActivate 메서드 호출
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();

      const user = request.user as User;
      // 인증된 사용자인지 확인
      return !!user;
    } catch (error) {
      // 예외 처리: 인증 실패 시 401 상태 코드 반환
      console.error('Error in UserGuard:', error);

      if (error.name === 'UnauthorizedException') {
        throw new UnauthorizedException(HttpErrorConstants.AUTH_TOKEN_INVALID);
      }
      // 기본적으로 false를 반환하여 인증을 거부합니다.
      return false;
    }
  }
}
