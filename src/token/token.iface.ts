import { BigNumber } from 'ethers';

export interface IToken {
  address(): string;
  decimals(): Promise<number>;
  symbol(): Promise<string>;
  balanceOf(address: string): Promise<BigNumber>;
}
