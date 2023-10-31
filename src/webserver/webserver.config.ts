import { Injectable } from '@nestjs/common';
import { IsPort } from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class WebserverConfig {
  @IsPort()
  public readonly port = parseInt(process.env.PORT || '0');

  constructor() {
    validateSyncOrFail(this);
  }
}
