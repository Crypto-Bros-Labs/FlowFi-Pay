export interface HistoryResponse {
  chargingOrders: RecoveryOrderModel[];
  withdrawalOrders: WithdrawalOrderModel[];
  depositOrders: DepositOrderModel[];
  crossOrders: CrossRampOrderModel[];
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

export type CrossRampOrderModel = {
  sourceAmount: string;
  targetAmount: string;
  targetCountry: string;
  orderUuid: string;
  transactionId: string;
  accountIdentifier: string;
  beneficiaryName: string;
  sourceBankName: string;
  concept: string;
  status?: string;
  createdAt: string;
};
