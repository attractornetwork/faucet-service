import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress } from 'class-validator';
import { randomBytes } from 'crypto';
import { getAddress } from 'ethers/lib/utils';

class FaucetToken {
  @ApiProperty({ example: getAddress('0x' + randomBytes(20).toString('hex')) })
  address: string;

  @ApiProperty({ example: 'ATTRA' })
  symbol: string;
}

class FaucetDispensation {
  @ApiProperty({ type: FaucetToken })
  token: FaucetToken;

  @ApiProperty({ example: 1 })
  amount: number;
}

export class FaucetInfoResponse {
  @ApiProperty({ example: true })
  enabled: true;

  @ApiProperty({ example: getAddress('0x' + randomBytes(20).toString('hex')) })
  address: string;

  @ApiProperty({ example: 9996 })
  balance: number;

  @ApiProperty({ type: FaucetDispensation })
  dispensation: FaucetDispensation;
}

export class FaucetTriggerRequest {
  @IsEthereumAddress()
  @ApiProperty({ example: getAddress('0x' + randomBytes(20).toString('hex')) })
  readonly address: string;
}

class FaucetTransaction {
  @ApiProperty({ example: '0x' + randomBytes(32).toString('hex') })
  hash: string;

  @ApiProperty({ example: 'https://explorer.shapley.attra.me/tx/0x' })
  url: string;
}

export class FaucetTriggerResponse {
  @ApiProperty({ type: FaucetTransaction })
  transaction: FaucetTransaction;
}
