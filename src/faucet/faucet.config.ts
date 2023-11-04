import { Injectable } from '@nestjs/common';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { validateSyncOrFail } from 'src/common';

@Injectable()
export class FaucetConfig {
  /**
   * ## Address of deployed Faucet smart-contract
   */
  @IsEthereumAddress()
  public readonly contractAddress = process.env.FAUCET_CONTRACT_ADDRESS;

  /**
   * ## Private key of account sending transaction
   *
   * Generally, any account with enough gas
   */
  @IsString()
  @Length(66, 66)
  public readonly workerPk = process.env.FAUCET_WORKER_PK;

  /**
   * ## Private key of account, signing dispension proofs
   *
   * **trusted signer** in context of a faucet
   */
  @IsString()
  @Length(66, 66)
  public readonly signerPk = process.env.FAUCET_SIGNER_PK;

  /**
   * ## Salt needed to protect identities (ips) from revealing
   */
  @IsString()
  @IsNotEmpty()
  public readonly identitySalt = process.env.FAUCET_IDENTITY_SALT;

  /**
   * ## Comma separated list of team IP addresses
   */
  @IsString()
  private readonly teamIp = process.env.FAUCET_TEAM_IP ?? '';

  public teamIpAddrs(): string[] {
    return this.teamIp.split(',');
  }

  constructor() {
    validateSyncOrFail(this);
  }
}
