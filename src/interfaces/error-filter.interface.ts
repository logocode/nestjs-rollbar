import { HttpException, ExecutionContext } from '@nestjs/common';

/**
 * An exception filter, much like Array.filter(), should return `true` to keep
 * the Error and log it, and false to remove the error.
 */
export type ExceptionFilter = (
  e: HttpException | unknown,
  context: ExecutionContext,
) => boolean;
