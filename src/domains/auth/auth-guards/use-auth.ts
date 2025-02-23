import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserGuard } from './auth.gurad';

const UseAuthGuards = () => {
  return applyDecorators(UseGuards(UserGuard));
};

export default UseAuthGuards;
