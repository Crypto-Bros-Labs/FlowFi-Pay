import walletApiService from "../api/walletApiService";
import type { SendCryptoResponse } from "../models/walletModel";

class WalletRepository {
    async sendCrypto(userUuid: string, tokenNetworkUuid: string, amount: number, destinationWalletAddress: string): Promise<SendCryptoResponse> {
        const response = await walletApiService.sendTransaction({
            userUuid,
            tokenNetworkUuid,
            amount,
            destinationWalletAddress
        });

        if (response.success) {
            console.log('✅ Transacción enviada con éxito:', response);
            return response;

        } else {
            console.error('❌ Error al enviar la transacción:', response);
            throw new Error('Failed to send transaction');
        }
    }
}

export const walletRepository = new WalletRepository();