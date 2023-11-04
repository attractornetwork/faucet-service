import { Injectable } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Injectable()
export class CaptchaConfig {
  /**
   * ## Google ReCaptcha secret key
   */
  @IsString()
  @IsNotEmpty()
  readonly secretKey = process.env.CAPTCHA_SECRET_KEY;

  /**
   * ## Key needed to bypass captcha-secured request (testing purposes only)
   *
   * If the key is absent, then no bypass is available
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly bypassKey? = process.env.CAPTCHA_BYPASS_KEY;
}
