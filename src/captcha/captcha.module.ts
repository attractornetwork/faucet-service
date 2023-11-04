import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CaptchaConfig } from './captcha.config';
import { CaptchaService } from './captcha.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [CaptchaConfig, CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
