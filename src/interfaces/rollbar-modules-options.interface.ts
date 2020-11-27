import { Configuration as RollbarClientConfiguration } from 'rollbar';
import { ExceptionFilter } from './error-filter.interface';
import * as Rollbar from 'rollbar';

export interface RollbarModuleOptions {
  config: RollbarClientConfiguration | Rollbar;

  /**
   * Marks the module as globally scoped in Nestjs's context, allowing
   * the providers to be available without being imported in other modules.
   */
  global?: boolean;

  /**
   * Allows filtering of application exceptions, preventing them from being logged to
   * Rollbar.  If the function returns true, the error will be logged to Rollbar.  If
   * the function returns false, the error will not be logged.
   *
   * Note: If the filter function itself throws an error, then the new Error will be used.
   * This is helpful in cases where you want to override the error sent to rollbar.  However,
   * the original Error is still thrown by the interceptor.
   */
  exceptionFilter?: ExceptionFilter;

  /** Prevents logging 4xx errors to Rollbar.  Only 5xx and uncaught exceptions are logged. */
  onlyFatalExceptions?: boolean;
}
