import { Injectable, OnModuleInit } from "@nestjs/common";
import { IsPort, validateOrReject } from 'class-validator';

@Injectable()
export class WebserverConfig implements OnModuleInit {
  @IsPort()
  public readonly port = parseInt(process.env.PORT ?? '0');

  async onModuleInit(): Promise<void> {
    await validateOrReject(this);
  }
}
