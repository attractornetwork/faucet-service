import { Inject, Injectable, Provider } from '@nestjs/common';
import { ethers } from 'ethers';
import { FaucetContractRef, FaucetWorkerRef } from './faucet.ref';
import { Faucet } from './faucet.typechain';

@Injectable()
export class FaucetService {
  constructor(
    @Inject(FaucetWorkerRef) private readonly worker: ethers.Wallet,
    @Inject(FaucetWorkerRef) private readonly signer: ethers.Wallet,
    @Inject(FaucetContractRef) private readonly faucet: Faucet,
  ) {}
}
