import { ethers } from 'ethers';
import { TokenErc20 } from './token-erc20';
import { TokenEther } from './token-ether';
import { IToken } from './token.iface';

export function getToken(
  address: string,
  provider: ethers.providers.Provider,
): IToken {
  if (address === '0x' + '0'.repeat(40)) {
    return new TokenEther('ATTRA', provider);
  } else {
    return new TokenErc20(address, provider);
  }
}
