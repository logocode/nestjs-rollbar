# NestJS Rollbar Module

Nest Module for logging and monitoring with Rollbar. Makes the Rollbar client,
as well as an Interceptor, available within the application once imported.

### Installation

```JavaScript
npm install @logocode/nestjs-rollbar
```

### Basic Usage

All that's needed is to pass your Rollbar configuration into the Rollbar Module.

```JavaScript

import { RollbarModule } from '@logocode/nestjs-rollbar'

// This is the configuration you'd normally pass to Rollbar
const rollbarOrConfig = { accessToken: 'your_server_token_here' }

@Module({
  imports: [
    RollbarModule.forRoot( { rollbarOrConfig } ),
  ],
})
export class AppModule {}

```

### Injecting Rollbar into Services

After you've added the code form "Basic Usage", you can inject Rollbar anywhere you'd like.
The module exports a `RollbarProvider` token, which can be used for DI.

```JavaScript
import { RollbarProvider } from '@logocode/nestjs-rollbar';

@Injectable()
export class CatsService {
  constructor(
    @Inject(RollbarProvider) rollbar: Rollbar
  ) {}

  petCat() {
      try {
          throw new Error('The cat bit you.')
      } catch(e) {
          this.rollbar.critical(`Ouch!`, e)
      }
  }
}
```

### Using the Rollbar Module Interceptor

If you'd like to log exceptions globally, you can install the interceptor
that is provided by this package.

In your `main.ts`:

```JavaScript
import { RollbarInterceptorProvider } from '@logocode/nestjs-rollbar';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const interceptor = app.get(RollbarInterceptorProvider);
  app.useGlobalInterceptors(interceptor);
}
```

From now on, every exception thrown by your application will also log to Rollbar. This does
not handle the error for you, it only logs it.

### Advanced Usage

##### Only logging fatal exceptions in the interceptor

This will prevent any HTTP errors in the 4xx status range from being logged to Rollbar. Server errors,
or uncaught JS exceptions will still be logged.

```JavaScript
@Module({
  imports: [
    RollbarModule.forRoot( { rollbarOrConfig, onlyFatalExceptions: true } ),
  ],
})
export class AppModule {}

```

##### Exception Filtering

If you need more control over how your errors are filtered, or the errors that you'd like to send to Rollbar,
you can use exception filtering. This allows you to skip logging, or log a different error, depending on the
output of a function.

```JavaScript

const exceptionFilter = (e: HttpException | unknown, context: ExecutionContext): boolean => {
    const status =
      e instanceof HttpException
        ? e.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // how an unauth request as a 404
    if (status === 403) {
        throw new NotFoundException(`The route you're looking for doesnt exist???`)
    }
}

@Module({
  imports: [
    RollbarModule.forRoot( { rollbarOrConfig, exceptionFilter } ),
  ],
})
export class AppModule {}
```
