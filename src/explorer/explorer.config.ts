import { Injectable, OnModuleInit } from '@nestjs/common';
import { IsUrl, validateOrReject } from 'class-validator';

@Injectable()
export class ExplorerConfig implements OnModuleInit {
  @IsUrl()
  public readonly baseUrl: string = process.env.EXPLORER_BASE_URL;

  async onModuleInit(): Promise<void> {
    await validateOrReject(this);
  }
}
