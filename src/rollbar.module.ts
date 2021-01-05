import { RollbarInterceptor } from './rollbar.interceptor';
import { Module, DynamicModule } from '@nestjs/common';
import { RollbarProvider, RollbarInterceptorProvider } from './constants';
import { Configuration as RollbarClientConfiguration } from 'rollbar';
import * as Rollbar from 'rollbar';

import { RollbarModuleOptions } from './interfaces/rollbar-modules-options.interface';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({})
export class RollbarModule {
  /**
   * Creates or uses an instance of Rollbar, injecting it into the application.  `RollbarProvider`
   * can be used to inject the Rollbar client, or retrieve it from the application context.
   *
   * An interceptor, with the provider token `RollbarInterceptorProvider`, is also made
   * available using the Rollbar instance.  The options object can be used to configure the
   * handling of that.
   *
   * @param options Configuration for Rollbar and the modules providers.
   */
  static forRoot(options: RollbarModuleOptions): DynamicModule {
    const rollbar = this.getRollbarInstance(options.config);

    const rollbar_provider = {
      provide: RollbarProvider,
      useValue: rollbar,
    };

    const interceptor = new RollbarInterceptor(rollbar, options);

    const rollbar_interceptor_provider = {
      provide: RollbarInterceptorProvider,
      useValue: interceptor,
    };

    const providers = [rollbar_provider, rollbar_interceptor_provider];

    if (options.useGlobalInterceptor) {
      providers.push({
        provide: APP_INTERCEPTOR,
        useValue: interceptor,
      });
    }

    const exports = [rollbar_provider, rollbar_interceptor_provider];

    return {
      module: RollbarModule,
      providers: providers,
      exports: exports,
      global: typeof options.global === 'undefined' ? true : options.global,
    };
  }

  /**
   * Returns a given Rollbar instance, or a new Rollbar instance,
   * depending on what is passed.
   */
  private static getRollbarInstance(
    rollbarOrConfig: RollbarClientConfiguration | Rollbar,
  ): Rollbar {
    let rollbar: Rollbar;
    if (rollbarOrConfig instanceof Rollbar) {
      rollbar = rollbarOrConfig;
    } else {
      rollbar = new Rollbar(rollbarOrConfig);
    }

    return rollbar;
  }
}
