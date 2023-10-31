import { Module } from "@nestjs/common";
import { FaucetModule } from "./faucet/faucet.module";
import { WebserverModule } from "./webserver/webserver.module";

@Module({
  imports: [WebserverModule, FaucetModule],
})
export class AppModule {}
