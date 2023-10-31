export class FaucetInfoResponse {
  enabled: true;
  address: string;
  balance: number;
  dispension: {
    token: {
      address: string;
      symbol: string;
    };
    amount: number;
  };
}

export class FaucetTriggerRequest {
  address: string;
}

export class FaucetTriggerResponse {
  transaction: {
    hash: string;
    url: string;
  };
}
