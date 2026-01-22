export interface HistoryResponse {
  chargingOrders: RecoveryOrderModel[];
  withdrawalOrders: WithdrawalOrderModel[];
  depositOrders: DepositOrderModel[];
}

export type RecoveryOrderModel = {
  orderUuid: string;
  name: string;
  TokenSymbol: string;
  cryptoAmount: string;
  FiatCurrencySymbol: string;
  FiatCurrencyAmount: string;
  network: string;
  exchangeValue: string;
  createdAt: string;
  status?: string;
  userWalletAddress: string;
};

export type WithdrawalOrderModel = {
  transactionId: string;
  orderUuid: string;
  name: string;
  TokenSymbol: string;
  cryptoAmount: string;
  FiatCurrencySymbol: string;
  FiatCurrencyAmount: string;
  network: string;
  exchangeValue: string;
  createdAt: string;
  status?: string;
  capaWallet: string;
};

export type DepositOrderModel = {
  transactionId: string;
  orderUuid: string;
  name: string;
  TokenSymbol: string;
  cryptoAmount: string;
  FiatCurrencySymbol: string;
  FiatCurrencyAmount: string;
  network: string;
  exchangeValue: string;
  createdAt: string;
  status?: string;
  capaClabe: string;
};
