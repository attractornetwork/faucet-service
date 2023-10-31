import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Length,
  validateOrReject,
} from 'class-validator';

@Injectable()
export class FaucetConfig implements OnModuleInit {
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

  async onModuleInit(): Promise<void> {
    await validateOrReject(this);
  }
}
