import { Injectable } from '@nestjs/common';
import { IsUrl } from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class EthersConfig {
  @IsUrl()
  public readonly provierUrl = process.env.ETHERS_PROVIDER_URL;

  constructor() {
    validateSyncOrFail(this);
  }
}
