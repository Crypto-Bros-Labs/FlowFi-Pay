import { axiosInstance } from "../../../../shared/api/axiosService";
import type { SendCryptoRequest, SendCryptoResponse } from "../models/walletModel";

class WalletApiService {
    async sendTransaction(request: SendCryptoRequest): Promise<SendCryptoResponse> {
        const response = await axiosInstance.post('/wallet/transfer', request);
        return {
            transactionURL: response.data.data.data.transactionURL,
            transactionHash: response.data.data.data.transactionHash,
            success: response.data.success
        };
    }
}

export default new WalletApiService();