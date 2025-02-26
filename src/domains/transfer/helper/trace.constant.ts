import { TraceMessage } from '../../../core/decorators/trace.decorator';
import { HttpErrorConstants } from './http.error.objects';

export const TRANSFER_TRACE = {
  GET_TRANSFER_QUOTE_CONTROLLER: {
    message: 'TransferController getTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  GET_TRANSFER_QUOTE_SERVICE: {
    message: 'TransferService getTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  REQUEST_TRANSFER_QUOTE_CONTROLLER: {
    message: 'TransferController requestTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  REQUEST_TRANSFER_QUOTE_SERVICE: {
    message: 'TransferService requestTransferQuote',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  TODAY_USER_TRANSFER_HISTORY: {
    message: 'TransferRepository todayUserTransferHistory',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  GET_USER_TRANSCTION_HISTORY_CONTROLLER: {
    message: 'TransferController getUserTransactionHistory',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  GET_USER_TRANSCTION_HISTORY_SERVICE: {
    message: 'TransferService getUserTransactionHistory',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,

  GET_USER_TRANSCTION_HISTORY_REPOSITORY: {
    message: 'TransferRepository getUserTransactionHistory',
    errorMessage: HttpErrorConstants.INTERNAL_SERVER_ERROR,
  } as TraceMessage,
};
