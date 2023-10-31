import { Module } from '@nestjs/common';
import { ethers } from 'ethers';
import { EthersConfig } from './ethers.config';

@Module({
  providers: [
    {
      provide: ethers.providers.Provider,
      inject: [EthersConfig],
      useFactory: ({ provierUrl }: EthersConfig) =>
        ethers.providers.getDefaultProvider(provierUrl),
    },
  ],
  exports: [ethers.providers.Provider],
})
export class EthersModule {}
