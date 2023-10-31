import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { createHash } from 'crypto';
import { ethers, Signature } from 'ethers';
import { ExplorerService } from 'src/explorer/explorer.service';
import { getToken } from 'src/token/get-token';
import { IToken } from 'src/token/token.iface';
import { FaucetInfoResponse, FaucetTriggerResponse } from './dto';
import { FaucetConfig } from './faucet.config';
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
    private readonly config: FaucetConfig,
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
        await this.token.balanceOf(this.faucet.address),
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

  async trigger(address: string, ip: string): Promise<FaucetTriggerResponse> {
    const identity = this.createIdentity(ip);
    const deadline = this.electDeadline();
    const signature = await this.createSignature(address, identity, deadline);
    const actor = { addr: address, name: identity };
    const faucet = this.faucet.connect(this.worker);
    const tx = await faucet.dispense(actor, signature, deadline);

    return {
      transaction: {
        hash: tx.hash,
        url: this.explorer.locateTransaction(tx.hash),
      },
    };
  }

  private electDeadline(): number {
    const timestamp = Math.round(Date.now() / 1000);
    const tenMinutes = 60 * 10;
    return timestamp + tenMinutes;
  }

  private createIdentity(ip: string): string {
    const checksum = `You're not gonna know my ip (${ip}) because ${this.config.identitySalt}`;
    const hash = createHash('sha256').update(checksum);
    return '0x' + hash.digest('hex');
  }

  private async createSignature(
    address: string,
    identity: string,
    deadline: number,
  ): Promise<Signature> {
    const hash = ethers.utils.solidityKeccak256(
      ['string', 'address', 'bytes32', 'address', 'uint64'],
      [
        'Attractor faucet dispension! Our lucky guy is',
        address,
        identity,
        this.faucet.address,
        deadline,
      ],
    );
    const hashBytes = ethers.utils.arrayify(hash);
    const sigString = await this.signer.signMessage(hashBytes);
    return ethers.utils.splitSignature(sigString);
  }
}
