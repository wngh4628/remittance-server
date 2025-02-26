import { Body, Controller, Post, Res } from '@nestjs/common';

import { AuthService } from './auth.service';
import HttpResponse from '../../core/http/http-response';
import { LoginDto } from './dtos/login.dto';
import { TraceTemplate } from '../../core/template/trace.template';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { AUTH_TRACE } from './helper/trace.constant';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly traceTemplate: TraceTemplate,
  ) {}

  @Post('/login')
  @TraceExecution(AUTH_TRACE.LOGIN_USER_CONTROLLER)
  async login(
    @Res() res,
    @Body()
    dto: LoginDto,
  ) {
    const result = await this.authService.login(dto);
    return HttpResponse.ok(res, result);
  }
}
