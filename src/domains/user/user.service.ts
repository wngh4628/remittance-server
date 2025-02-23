import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dtos/create.user.dto';
import { UserRepository } from './repositories/user.repository';
import { UserVO } from './vo/user.vo';
import { TraceTemplate } from '../../core/template/trace.template';
import { TraceExecution } from '../../core/decorators/trace.decorator';
import { USER_TRACE } from './helper/trace.constant';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private readonly traceTemplate: TraceTemplate,
  ) {}
  /**
   *  회원가입
   * @param dto CreateUserDto
   * @returns user
   */
  @TraceExecution(USER_TRACE.CREATE_USER_SERVICE)
  async createUser(dto: CreateUserDto): Promise<boolean> {
    const userVo = new UserVO(dto);
    const userCreateEntity = userVo.toEntity();
    await this.userRepository.save(userCreateEntity);
    return true;
  }
}
