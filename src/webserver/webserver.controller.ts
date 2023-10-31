import { Controller, Get } from "@nestjs/common";

@Controller()
export class WebserverController {
  @Get('/status')
  getStatus(): string {
    return 'I am ok';
  }
}
