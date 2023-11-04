import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { CaptchaConfig } from './captcha.config';
import { CaptchaService } from './captcha.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [
    CaptchaConfig,
    CaptchaService,
    {
      provide: Logger,
      useValue: new Logger('Captcha'),
    },
  ],
  exports: [CaptchaService],
})
export class CaptchaModule {}
