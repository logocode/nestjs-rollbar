import { RollbarProvider } from './constants';
import { Configuration } from 'rollbar';
import * as Rollbar from 'rollbar';
import { RollbarModule } from './rollbar.module';
import { Test, TestingModule } from '@nestjs/testing';

const rollbarConfig: Configuration = {
  accessToken: 'test1234',
};

describe('RollbarModule', () => {
  describe('When the configuration is a Rollbar configuration object', () => {
    it('should create a new Rollbar instance', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [RollbarModule.forRoot({ rollbarOrConfig: rollbarConfig })],
      }).compile();

      const rollbar = module.get<Rollbar>(RollbarProvider);

      expect(rollbar).toBeInstanceOf(Rollbar);
      // Sanity check that we're passing in our options as well.
      expect(rollbar.options.accessToken).toBe(rollbarConfig.accessToken);
    });
  });

  describe('When the configuration is an instance of Rollbar', () => {
    it('should re-use the given Rollbar isntance', async () => {
      const rollbar = new Rollbar(rollbarConfig);

      const module: TestingModule = await Test.createTestingModule({
        imports: [RollbarModule.forRoot({ rollbarOrConfig: rollbar })],
      }).compile();

      const instance = module.get<Rollbar>(RollbarProvider);

      expect(instance).toBe(rollbar);
    });
  });

  describe('RollbarModuleOptions object', () => {
    describe('When global is set to true', () => {
      it('should mark the module as global', async () => {
        const module = RollbarModule.forRoot({
          rollbarOrConfig: rollbarConfig,
          global: true,
        });

        expect(module.global).toBeTruthy();
      });
    });

    describe('Otherwise', () => {
      it('should not mark the module as global', async () => {
        const module = RollbarModule.forRoot({
          rollbarOrConfig: rollbarConfig,
          global: true,
        });

        expect(module.global).toBeTruthy();
      });
    });
  });
});
