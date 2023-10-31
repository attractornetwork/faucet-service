import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
import { ExplorerService } from 'src/explorer/explorer.service';
import { getToken } from 'src/token/get-token';
import { IToken } from 'src/token/token.iface';
import {
  FaucetInfoResponse,
  FaucetTriggerRequest,
  FaucetTriggerResponse,
} from './dto';
import { FaucetContractRef, FaucetWorkerRef } from './faucet.ref';
import { Faucet } from './faucet.typechain';

@Injectable()
export class FaucetService implements OnModuleInit {
  private token: IToken;

  constructor(
    @Inject(FaucetWorkerRef) private readonly worker: ethers.Wallet,
    @Inject(FaucetWorkerRef) private readonly signer: ethers.Wallet,
    @Inject(FaucetContractRef) private readonly faucet: Faucet,
    private readonly explorer: ExplorerService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.loadToken();
  }

  private async loadToken(): Promise<void> {
    const address = await this.faucet.token();
    this.token = getToken(address, this.faucet.provider);
  }

  async getInfo(): Promise<FaucetInfoResponse> {
    return {
      enabled: true,
      address: this.faucet.address,
      balance: +ethers.utils.formatUnits(
        await this.faucet.portion(),
        await this.token.decimals(),
      ),
      dispension: {
        token: {
          address: this.token.address(),
          symbol: await this.token.symbol(),
        },
        amount: +ethers.utils.formatUnits(
          await this.faucet.portion(),
          await this.token.decimals(),
        ),
      },
    };
  }

  async trigger(request: FaucetTriggerRequest): Promise<FaucetTriggerResponse> {
    throw new Error('Not implemented');
  }
}
