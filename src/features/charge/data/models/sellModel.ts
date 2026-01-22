export interface OffRampResponse {
  successTransfer: boolean;
  details: string;
  kycStatus: string;
  kycUrl: string;
  destinationWalletAddress?: string;
  transactionId?: string;
  orderUuid?: string;
}

export interface OffRampData {
  userUuid: string;
  providerUuid: string;
  tokenNetworkUuid: string;
  fiatCurrencyUuid: string;
  userBankInformationUuid: string;
  amount: number;
  isExternalWallet: boolean;
}

export type OnRampData = {
  userUuid: string;
  providerUuid: string;
  tokenNetworkUuid: string;
  fiatCurrencyUuid: string;
  walletAddress: string;
  amount: number;
};

export type OnRampResponse = {
  details: string;
  kycUrl: string;
  destinationWalletAddress: string;
  bankAccountIdentifier: string;
  cryptoAmount: string;
  fiatAmount: string;
  id: string;
  orderUuid: string;
};

export interface QuoteData {
  providerUuid: string;
  fromUuuid: string;
  toUuid: string;
  amountFiat: string;
  type: string;
  isCryptoResponse: boolean;
}

export interface QuoteResponse {
  exactFiatAmount: number;
  displayFiatAmount: string;
  exactCryptoAmount: number;
  displayCryptoAmount: string;
}

export type RecoveryOrderData = {
  userUuid: string;
  fiatCurrencyUuid: string;
  tokenUuid: string;
  fiatCurrencyAmount: string;
  tokenAmount: string;
  exchangeValue: number;
};
