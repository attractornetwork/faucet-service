import { INestApplication, Injectable } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WebserverConfig } from './webserver.config';

@Injectable()
export class WebserverInitializer {
  constructor(private readonly config: WebserverConfig) {}

  async start(app: INestApplication): Promise<void> {
    const config = new DocumentBuilder()
      .setTitle('Attractor faucet')
      .setDescription('Attractor faucet API description')
      .setVersion('1.0')
      .addTag('faucet')
      .addServer('http://localhost:3000/', 'Local service')
      .addServer('https://faucet.shapley.attra.me/api/', 'Shapley testnet service')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(this.config.port);
  }
}
