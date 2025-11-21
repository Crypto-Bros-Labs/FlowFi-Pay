export type SendCryptoRequest = {
    userUuid: string;
    tokenNetworkUuid: string;
    amount: number;
    destinationWalletAddress: string;
}

export type SendCryptoResponse = {
    transactionURL: string;
    transactionHash: string;
    success: boolean;
}

