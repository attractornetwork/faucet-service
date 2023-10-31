import { Injectable, OnModuleInit } from "@nestjs/common";
import { IsEthereumAddress, IsString, Length, validateOrReject } from 'class-validator';

@Injectable()
export class FaucetConfig implements OnModuleInit {
  @IsEthereumAddress()
  public readonly contractAddress = process.env.FAUCET_CONTRACT_ADDRESS;

  @IsString()
  @Length(66, 66)
  public readonly workerPk = process.env.FAUCET_WORKER_PK;

  @IsString()
  @Length(66, 66)
  public readonly signerPk = process.env.FAUCET_SIGNER_PK;

  async onModuleInit(): Promise<void> {
    await validateOrReject(this);
  }
}
