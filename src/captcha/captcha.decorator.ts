import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { CaptchaGuard } from './captcha.guard';

export function CaptchaProtected(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    UseGuards(CaptchaGuard),
    ApiHeader({
      name: CaptchaGuard.ValueHeader,
      required: false,
      description: 'Value of captcha solved on client side',
      example: '0L3RgyDRh9C10Lsp',
    }),
    ApiHeader({
      name: CaptchaGuard.BypassHeader,
      required: false,
      description: 'Key to bypass captcha check',
      example: 'i_hate_captcha',
    }),
  );
}
