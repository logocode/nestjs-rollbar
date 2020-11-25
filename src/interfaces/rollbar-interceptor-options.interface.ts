import { ErrorFilterFunction } from './error-filter.interface';

export interface RollbarInterceptorOptions {
  errorFilter?: ErrorFilterFunction;

  minStatusCode?: number;
}
