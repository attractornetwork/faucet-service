import { Logger, Module } from '@nestjs/common';
import { ethers } from 'ethers';
import { EthersModule } from 'src/ethers/ethers.module';
import { FaucetConfig } from './faucet.config';
import { FaucetController } from './faucet.controller';
import { FaucetService } from './faucet.service';
import * as FaucetABI from './faucet.abi.json';
import {
  FaucetContractRef,
  FaucetSignerRef,
  FaucetWorkerRef,
} from './faucet.ref';
import { ExplorerModule } from 'src/explorer/explorer.module';
import { CaptchaModule } from 'src/captcha/captcha.module';

@Module({
  imports: [EthersModule, ExplorerModule, CaptchaModule],
  providers: [
    FaucetConfig,
    FaucetService,
    {
      provide: FaucetWorkerRef,
      inject: [FaucetConfig, ethers.providers.Provider],
      useFactory: (
        { workerPk }: FaucetConfig,
        provider: ethers.providers.Provider,
      ) => new ethers.Wallet(workerPk).connect(provider),
    },
    {
      provide: FaucetSignerRef,
      inject: [FaucetConfig, ethers.providers.Provider],
      useFactory: (
        { signerPk }: FaucetConfig,
        provider: ethers.providers.Provider,
      ) => new ethers.Wallet(signerPk).connect(provider),
    },
    {
      provide: FaucetContractRef,
      inject: [FaucetConfig, ethers.providers.Provider],
      useFactory: (
        { contractAddress }: FaucetConfig,
        provider: ethers.providers.Provider,
      ) => new ethers.Contract(contractAddress, FaucetABI, provider),
    },
    {
      provide: Logger,
      useValue: new Logger('Faucet'),
    },
  ],
  controllers: [FaucetController],
})
export class FaucetModule {}
