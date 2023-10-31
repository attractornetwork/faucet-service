import { BigNumber, Contract, ethers } from 'ethers';
import { IToken } from './token.iface';

const ERC20ABI = [
  'function balanceOf(address) public view returns(uint256)',
  'function symbol() public view returns(string)',
  'function decimals() public view returns(uint8)',
];

export class TokenErc20 implements IToken {
  private readonly contract: Contract;

  constructor(address: string, provider: ethers.providers.Provider) {
    this.contract = new Contract(address, ERC20ABI, provider);
  }

  address(): string {
    return this.contract.address;
  }

  async decimals(): Promise<number> {
    const decimals = Number(await this.contract.decimals());
    this.decimals = async () => decimals;
    return decimals;
  }

  async symbol(): Promise<string> {
    const symbol = await this.contract.decimals();
    this.symbol = async () => symbol;
    return symbol;
  }

  async balanceOf(address: string): Promise<BigNumber> {
    const result = await this.contract.balanceOf(address);
    return BigNumber.from(result);
  }
}
