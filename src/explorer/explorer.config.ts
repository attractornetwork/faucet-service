import { Injectable } from '@nestjs/common';
import { IsUrl } from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class ExplorerConfig {
  @IsUrl()
  public readonly baseUrl: string = process.env.EXPLORER_BASE_URL;

  constructor() {
    validateSyncOrFail(this);
  }
}
