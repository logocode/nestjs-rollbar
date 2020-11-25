import { ExceptionFilter } from './error-filter.interface';

export interface RollbarInterceptorOptions {
  errorFilter?: ExceptionFilter;

  onlyFatalExceptions?: boolean;
}
