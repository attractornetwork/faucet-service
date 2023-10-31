import { Injectable, OnModuleInit } from '@nestjs/common';
import { IsUrl, validateOrReject } from 'class-validator';

@Injectable()
export class EthersConfig implements OnModuleInit {
  @IsUrl()
  public readonly provierUrl = process.env.ETHERS_PROVIDER_URL;

  async onModuleInit(): Promise<void> {
    await validateOrReject(this);
  }
}
