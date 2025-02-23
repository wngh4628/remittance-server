import { TraceMessage } from '../../../core/decorators/trace.decorator';
import { HttpErrorConstants } from './http.error.objects';

export const USER_TRACE = {
  CREATE_USER_CONTROLLER: {
    message: 'UserController createUser',
    errorMessage: HttpErrorConstants.USER_REGISTERED_FAIL,
  } as TraceMessage,

  CREATE_USER_SERVICE: {
    message: 'UserService createUser',
    errorCodeMap: { ER_DUP_ENTRY: HttpErrorConstants.DUPLICATE_USER_ID },
    errorMessage: HttpErrorConstants.USER_REGISTERED_FAIL,
  } as TraceMessage,
};
