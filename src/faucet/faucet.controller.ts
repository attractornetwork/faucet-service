import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CaptchaGuard } from 'src/captcha/captcha.guard';
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
  @UseGuards(CaptchaGuard)
  @ApiHeader({
    name: CaptchaGuard.ValueHeader,
    required: false,
    description: 'Value of captcha solved on client side',
  })
  @ApiHeader({
    name: CaptchaGuard.BypassHeader,
    required: false,
    description: 'Key to bypass captcha check',
  })
  async triggerFaucet(
    @Body() { address }: FaucetTriggerRequest,
    @Req() request: Request,
  ): Promise<FaucetTriggerResponse> {
    const ip = request.header('x-real-ip');
    if (!ip) throw new Error('x-real-ip header not set');
    return await this.faucetService.trigger(address, ip);
  }
}
