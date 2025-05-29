import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebserverInitializer } from './webserver/webserver.initializer';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const webserver = app.get(WebserverInitializer);
  await webserver.start(app);
})();

process.on('uncaughtException', (e: Error) => {
  console.warn(`An uncaught exception: ${e}`);
});

process.on('unhandledRejection', (e: Error) => {
  console.warn(`An unhandled rejection: ${e}`);
});
