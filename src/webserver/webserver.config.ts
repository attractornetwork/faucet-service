import { Injectable } from '@nestjs/common';
import { IsInt, IsUrl } from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class WebserverConfig {
  @IsInt()
  readonly port = parseInt(process.env.PORT);

  @IsUrl()
  readonly publicUrl = process.env.PUBLIC_URL;

  constructor() {
    validateSyncOrFail(this);
  }
}
