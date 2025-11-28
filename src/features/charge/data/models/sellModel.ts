export interface OffRampResponse {
    successTransfer: boolean,
    details: string,
    kycStatus: string,
    kycUrl: string,
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