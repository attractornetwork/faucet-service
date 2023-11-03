import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class WebserverController {
  @Get('/status')
  @ApiTags('health')
  getStatus(): string {
    return 'I am ok';
  }
}
