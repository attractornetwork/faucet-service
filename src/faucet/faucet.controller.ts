import { Body, Controller, Get, Post } from '@nestjs/common';
import { FaucetInfoResponse, FaucetTriggerRequest, FaucetTriggerResponse } from './dto';

@Controller('faucet')
export class FaucetController {
  @Get('/info')
  async getInfo(): Promise<FaucetInfoResponse> {
    throw new Error('Not implemented');
  }

  @Post('/trigger')
  async triggerFaucet(@Body() { address }: FaucetTriggerRequest): Promise<FaucetTriggerResponse> {
    throw new Error('Not implemented');
  }
}
