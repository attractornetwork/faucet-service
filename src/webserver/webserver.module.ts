import { Module } from "@nestjs/common";
import { WebserverConfig } from "./webserver.config";
import { WebserverController } from "./webserver.controller";
import { WebserverInitializer } from "./webserver.initializer";

@Module({
  providers: [WebserverConfig, WebserverInitializer],
  controllers: [WebserverController],
})
export class WebserverModule {}
