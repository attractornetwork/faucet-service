import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CaptchaProtected } from 'src/captcha/captcha.decorator';
import {
  FaucetInfoResponse,
  FaucetTriggerRequest,
  FaucetTriggerResponse,
} from './dto';
import { FaucetService } from './faucet.service';

@Controller('faucet')
@ApiTags('faucet')
export class FaucetController {
  constructor(private readonly faucetService: FaucetService) {}

  @Get('/info')
  @ApiResponse({ type: FaucetInfoResponse })
  async getInfo(): Promise<FaucetInfoResponse> {
    return await this.faucetService.getInfo();
  }

  @Post('/trigger')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiBody({ type: FaucetTriggerRequest })
  @ApiResponse({ type: FaucetTriggerResponse })
  @CaptchaProtected()
  async triggerFaucet(
    @Body() { address }: FaucetTriggerRequest,
    @Req() request: Request,
  ): Promise<FaucetTriggerResponse> {
    const ip = request.header('x-real-ip');
    if (!ip) throw new Error('x-real-ip header not set');
    return await this.faucetService.trigger(address, ip);
  }
}
