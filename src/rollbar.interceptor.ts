import { RollbarInterceptorOptions } from './interfaces/rollbar-interceptor-options.interface';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Rollbar from 'rollbar';
import { Request } from 'express';

@Injectable()
export class RollbarInterceptor implements NestInterceptor {
  constructor(
    private rollbar: Rollbar,
    private options: RollbarInterceptorOptions = {},
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((e) => this.handleExceptionLogging(e, context)));
  }

  private handleExceptionLogging(
    e: HttpException | Error,
    context: ExecutionContext,
  ) {
    const status =
      e instanceof HttpException
        ? e.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const handler = context.getClass();
    const request = context.switchToHttp().getRequest<Request>();

    let should_log = true;
    try {
      if (typeof this.options.errorFilter === 'function') {
        should_log = this.options.errorFilter && this.options.errorFilter(e);
      } else if (this.options.onlyFatalExceptions) {
        should_log = status >= 500;
      }
    } catch (error) {}

    if (should_log) {
      this.rollbar.error(e, {
        controller: handler.name,
        path: request.path,
        query: request.query,
        status: status,
      });
    }

    return throwError(e);
  }
}
