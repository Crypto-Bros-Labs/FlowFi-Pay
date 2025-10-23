export interface OffRampResponse {
    details: string,
    kycUrl: string,
    destinationWalletAddress: string,
    cryptoAmount: string,
    fiatAmount: string
}

export interface OffRampData {
    userUuid: string,
    providerUuid: string,
    tokenNetworkUuid: string,
    fiatCurrencyUuid: string,
    userBankInformationUuid: string,
    amount: number,

}

export interface QuoteData {
    providerUuid: string,
    fromUuuid: string,
    toUuid: string,
    amountFiat: string,
}

export interface QuoteResponse {
    fiatAmount: number,
    exactCryptoAmount: number,
    displayCryptoAmount: string,
}