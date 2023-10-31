import { BigNumber, ethers } from 'ethers';
import { IToken } from './token.iface';

export class TokenEther implements IToken {
  constructor(
    private readonly mySymbol: string,
    private readonly provider: ethers.providers.Provider,
  ) {}

  async decimals(): Promise<number> {
    return 18;
  }

  async symbol(): Promise<string> {
    return this.mySymbol;
  }

  balanceOf(address: string): Promise<BigNumber> {
    return this.provider.getBalance(address);
  }

  address(): string {
    return '0x' + '0'.repeat(40);
  }
}
