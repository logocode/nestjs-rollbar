import { RollbarInterceptor } from './rollbar.interceptor';
import { Module, DynamicModule } from '@nestjs/common';
import { RollbarProvider, RollbarInterceptorProvider } from './constants';
import { Configuration as RollbarClientConfiguration } from 'rollbar';
import * as Rollbar from 'rollbar';

import { RollbarModuleOptions } from 'interfaces/rollbar-modules-options.interface';

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
   * @param rollbarOrConfig An instance of Rollbar, or the Rollbar configuration object
   * @param options Module options for configuring the interceptor and global settings
   */
  static forRoot(
    rollbarOrConfig: RollbarClientConfiguration | Rollbar,
    options: RollbarModuleOptions = {},
  ): DynamicModule {
    const rollbar = this.getRollbarInstance(rollbarOrConfig);

    const rollbar_provider = {
      provide: RollbarProvider,
      useValue: rollbar,
    };

    const rollbar_interceptor_provider = {
      provide: RollbarInterceptorProvider,
      useValue: new RollbarInterceptor(rollbar, options),
    };

    return {
      module: RollbarModule,
      providers: [rollbar_provider, rollbar_interceptor_provider],
      exports: [rollbar_provider, rollbar_interceptor_provider],
      global: !!options.global,
    };
  }

  /**
   * Helper function for parsing the instance from the given config.
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
