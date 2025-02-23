import { Controller, Post, Body, Res } from '@nestjs/common';

import { CreateUserDto } from './dtos/create.user.dto';
import { UserService } from './user.service';
import HttpResponse from '../../core/http/http-response';
import { REQUEST_SUCCESS_MESSAGE } from './helper/http.response.objects';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { USER_TRACE } from './helper/trace.constant';
import { TraceTemplate } from '../../core/template/trace.template';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly traceTemplate: TraceTemplate,
  ) {}

  @Post('signup')
  @TraceExecution(USER_TRACE.CREATE_USER_CONTROLLER)
  async createUser(@Res() res, @Body() dto: CreateUserDto) {
    const result = await this.userService.createUser(dto);
    if (result) {
      return HttpResponse.ok(
        res,
        REQUEST_SUCCESS_MESSAGE.USER_REGISTERED_SUCCESS,
      );
    }
  }
}
