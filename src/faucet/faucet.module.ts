import { Module } from "@nestjs/common";
import { FaucetConfig } from "./faucet.config";
import { FaucetController } from "./faucet.controller";
import { FaucetService } from "./faucet.service";

@Module({
  providers: [FaucetConfig, FaucetService],
  controllers: [FaucetController],
})
export class FaucetModule {}
