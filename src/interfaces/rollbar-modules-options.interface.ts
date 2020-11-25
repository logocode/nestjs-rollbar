import { ExceptionFilter } from './error-filter.interface';
export interface RollbarModuleOptions {
  /** Marks the module as globally scoped in Nestjs's context. */
  global?: boolean;

  /**
   * Allows filtering of application exceptions, preventing them from being logged to
   * Rollbar.  If the function returns true, the error will be logged to Rollbar.  If
   * the function returns false, the error will not be logged.
   *
   * Note: If the filter function itself throws an error, then the original error will be
   * logged to Rollbar.
   */
  exceptionFilter?: ExceptionFilter;

  /** Prevents logging 4xx errors to Rollbar.  Only 5xx and uncaught exceptions are logged. */
  onlyFatalExceptions?: number;
}
