import { HttpException } from '@nestjs/common';

/**
 * Allows filtering of application exceptions, preventing them from being logged to
 * Rollbar.  If the function returns true, the error will be logged to Rollbar.  If
 * the function returns false, the error will not be logged.
 *
 * Note: If the filter function itself throws an error, then the original error will be
 * logged to Rollbar.
 */
export type ExceptionFilter = (e: HttpException | unknown) => boolean;
