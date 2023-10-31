import { Body, Controller, Get, Post } from '@nestjs/common';
import { FaucetInfo, FaucetTrigger } from './dto';

@Controller('faucet')
export class FaucetController {
  @Get('/info')
  async getInfo(): Promise<FaucetInfo> {
    throw new Error('Not implemented');
  }

  @Post('/trigger')
  async triggerFaucet(@Body() { address }: FaucetTrigger): Promise<void> {
    throw new Error('Not implemented');
  }
}
