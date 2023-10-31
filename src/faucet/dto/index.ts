export class FaucetInfo {
  enabled: true;
  address: string;
  balance: number;
  dispension: {
    token: string;
    amount: number;    
  };
}

export class FaucetTrigger {
  address: string;
}
