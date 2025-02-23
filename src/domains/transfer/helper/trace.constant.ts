import { TraceMessage } from '../../../core/decorators/trace.decorator';
import { HttpErrorConstants } from './http.error.objects';

export const TRANSFER_TRACE = {
  CREATE_USER_CONTROLLER: {
    message: 'TransferController getTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  CREATE_USER_SERVICE: {
    message: 'TransferService getTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,
};
