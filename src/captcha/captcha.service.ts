import { Injectable, Logger } from '@nestjs/common';
import { CaptchaConfig } from './captcha.config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface SiteVerifyResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
}

@Injectable()
export class CaptchaService {
  constructor(
    private readonly config: CaptchaConfig,
    private readonly http: HttpService,
    private readonly logger: Logger,
  ) {}

  public canBypass(key: string): boolean {
    return key === this.config.bypassKey;
  }

  public async isValid(captcha: string, clientIp: string): Promise<boolean> {
    this.logger.log(`Validating captcha=${captcha} from ip=${clientIp}`);

    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const params = {
      secret: this.config.secretKey,
      response: captcha,
      remoteip: clientIp,
    };
    const obs = this.http.post<SiteVerifyResponse>(url, '', { params });
    const { data } = await firstValueFrom(obs);
    return !!data.success;
  }
}
