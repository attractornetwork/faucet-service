import {
  HttpException,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { ethers, Signature } from 'ethers';
import { ExplorerService } from 'src/explorer/explorer.service';
import { getToken } from 'src/token/get-token';
import { IToken } from 'src/token/token.iface';
import { FaucetInfoResponse, FaucetTriggerResponse } from './dto';
import { FaucetConfig } from './faucet.config';
import {
  FaucetContractRef,
  FaucetSignerRef,
  FaucetWorkerRef,
} from './faucet.ref';
import { Faucet } from './faucet.typechain';

@Injectable()
export class FaucetService implements OnModuleInit {
  private token: IToken;

  constructor(
    @Inject(FaucetWorkerRef) private readonly worker: ethers.Wallet,
    @Inject(FaucetSignerRef) private readonly signer: ethers.Wallet,
    @Inject(FaucetContractRef) private readonly faucet: Faucet,
    private readonly explorer: ExplorerService,
    private readonly config: FaucetConfig,
    private readonly logger: Logger,
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
      dispensation: {
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
    try {
      address = ethers.utils.getAddress(address);
    } catch (thrown) {
      throw new HttpException('Address checksum is invalid', 400);
    }

    const dispensionId = randomBytes(12).toString('base64url');
    this.logger.log(
      `Started dispension id=${dispensionId} addr=${address} ip=${ip}`,
    );

    const signer = await this.faucet.callStatic.signer();
    if (signer !== this.signer.address) {
      const msg = 'Faucet is unavailable. Please try later or contact Team';
      throw new HttpException(msg, 503);
    }

    const identity = this.createIdentity(ip);
    const deadline = this.electDeadline();
    const signature = await this.createSignature(address, identity, deadline);
    const actor = { addr: address, name: identity };
    const faucet = this.faucet.connect(this.worker);

    try {
      const tx = await faucet.dispense(actor, signature, deadline, {
        gasPrice: 2e9,
      });
      this.logger.log(`Dispension id=${dispensionId} succeeded`);

      return {
        transaction: {
          hash: tx.hash,
          url: this.explorer.locateTransaction(tx.hash),
        },
      };
    } catch (err) {
      this.logger.warn(`Dispension id=${dispensionId} failed`);
      this.logger.warn(err);

      throw new HttpException(
        'Seems like you received your tokens recently. Try later.',
        500,
      );
    }
  }

  private async awakeChain(): Promise<void> {
    let attempts = 0;

    while (attempts < 3) {
      const latestBlock = await this.worker.provider.getBlock('latest');
      const time = Math.round(Date.now() / 1000);
      const blockAge = time - latestBlock.timestamp;
      this.logger.log(`Latest block (${latestBlock.number}) elapsed ${blockAge}s`);
      const almostAnHour = 60 * 55;
      const isAwaken = blockAge < almostAnHour;
      if (isAwaken) break;
      this.logger.log('Awakening the chain...');
      const tx = await this.worker.sendTransaction({
        to: this.worker.address,
        value: ethers.utils.parseEther('0.1'),
        gasPrice: 2e9,
        gasLimit: 21000,
        chainId: 9701,
      });
      await tx.wait(1);
      attempts = attempts + 1;
    }
  }

  private electDeadline(): number {
    const timestamp = Math.round(Date.now() / 1000);
    const tenSeconds = 10;
    return timestamp + tenSeconds;
  }

  private createIdentity(ip: string): string {
    const salt = this.getSalt(ip);
    const checksum = `You're not gonna know my ip (${ip}) because ${salt}`;
    const hash = createHash('sha256').update(checksum);
    return '0x' + hash.digest('hex');
  }

  private getSalt(ip: string): string {
    const isTeam = this.config.teamIpAddrs().includes(ip);
    if (isTeam) return randomBytes(32).toString('base64url');
    else return this.config.identitySalt;
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
