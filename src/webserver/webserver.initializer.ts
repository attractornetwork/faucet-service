import { INestApplication, Injectable } from '@nestjs/common';
import { WebserverConfig } from './webserver.config';

@Injectable()
export class WebserverInitializer {
  constructor(private readonly config: WebserverConfig) {}

  async start(app: INestApplication): Promise<void> {
    app.listen(this.config.port);
  }
}
