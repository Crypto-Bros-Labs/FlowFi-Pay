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

export interface CrossQuoteData {
  providerUuid: string;
  sourceCurrencyUuid: string;
  targetCurrencyUuid: string;
  sourceAmount: number;
  targetAmount?: number;
}

export interface QuoteResponse {
  exactFiatAmount: number;
  displayFiatAmount: string;
  exactCryptoAmount: number;
  displayCryptoAmount: string;
}

export interface CrossQuoteResponse {
  sourceAmount: number;
  sourceCurrency: string;
  targetAmount: number;
  targetCurrency: string;
  rate: number;
  spread: number;
  flow: string;
}

export type RecoveryOrderData = {
  userUuid: string;
  fiatCurrencyUuid: string;
  tokenUuid: string;
  fiatCurrencyAmount: string;
  tokenAmount: string;
  exchangeValue: number;
};

export interface CrossRampData {
  userUuid: string;
  sourceCurrencyUuid: string;
  targetCurrencyUuid: string;
  liquidityProviderUuid: string;
  sourceAmount: number;
  targetAmount: number;
  quoteId?: string;
  bankAccountCountry?: string;
  bankAccountUuid: string;
  accountType?: string;
  documentIdentifier?: string;
}

export interface CrossRampResponse {
  details: string;
  verificationUrl: string;
  sourceCurrency: string;
  sourceAmount: string;
  targetCurrency: string;
  targetAmount: string;
  transactionId: string;
  orderUuid: string;
}
