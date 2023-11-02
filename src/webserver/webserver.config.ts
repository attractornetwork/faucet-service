import { Injectable } from '@nestjs/common';
import { IsInt } from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class WebserverConfig {
  @IsInt()
  public readonly port = parseInt(process.env.PORT);

  constructor() {
    validateSyncOrFail(this);
  }
}
