import { TraceMessage } from '../../../core/decorators/trace.decorator';
import { HttpErrorConstants } from './http.error.objects';

export const AUTH_TRACE = {
  LOGIN_USER_CONTROLLER: {
    message: 'AuthController login',
    errorMessage: HttpErrorConstants.USER_LOGIN_FAIL,
  } as TraceMessage,

  LOGIN_USER_SERVICE: {
    message: 'AuthService login',
    errorMessage: HttpErrorConstants.USER_LOGIN_FAIL,
  } as TraceMessage,
};
