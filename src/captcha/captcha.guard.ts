import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { CaptchaService } from './captcha.service';

@Injectable()
export class CaptchaGuard implements CanActivate {
  public static readonly ValueHeader = 'X-Captcha-Value';
  public static readonly BypassHeader = 'X-Captcha-Bypass-Key';

  constructor(private readonly captcha: CaptchaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const bypassKey = request.header(CaptchaGuard.BypassHeader);
    if (bypassKey) {
      if (this.captcha.canBypass(bypassKey)) return true;
      else throw new HttpException("Captcha bypass key didn't match", 403);
    }
    const clientIp = request.header('x-real-ip');
    const captcha = request.header(CaptchaGuard.ValueHeader);
    if (!clientIp) throw new Error('Client IP not provided');
    if (!captcha) throw new HttpException('No captcha response provided', 400);
    const isValid = await this.captcha.isValid(captcha, clientIp);
    if (!isValid) throw new HttpException("Captcha response didn't pass", 403);
    return true;
  }
}
