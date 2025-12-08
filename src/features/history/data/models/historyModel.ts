export interface HistoryResponse {
    chargingOrders: RecoveryOrderModel[],
    capaTransactions: CapaOrderModel[]
}

export type RecoveryOrderModel = {
    orderUuid: string,
    TokenSymbol: string,
    cryptoAmount: string,
    FiatCurrencySymbol: string,
    FiatCurrencyAmount: string,
    network: string,
    exchangeValue: string,
    createdAt: string,
    status?: string,
    userWalletAddress: string,
}

export type CapaOrderModel = {
    type: string,
    createdAt: string,
    status: string,
    cryptoAmount: string,
    fiatAmount: string,
    id: string
}