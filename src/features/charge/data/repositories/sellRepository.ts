import sellLocalService, { type Amounts, type SellData } from "../local/sellLocalService";
import { sellApiService } from "../api/sellApiService";
import type { OffRampData, QuoteData } from "../models/sellModel";

class SellRepository {
    async createOffRamp(data: OffRampData): Promise<{ success: boolean, kycUrl: string | null }> {
        try {
            const response = await sellApiService.createOffRamp(data);
            console.log('📨 API Response completa:', response);

            if (response.details === "SUCCESS") {
                const sellData = {
                    kycUrl: response.kycUrl,
                    destinationWalletAddress: response.destinationWalletAddress,
                    id: response.id
                };

                console.log('💾 Intentando guardar:', sellData);

                // Verificar antes de guardar
                console.log('📝 Datos antes de guardar:', sellLocalService.getSellData());

                sellLocalService.setSellData(sellData);

                // Verificar después de guardar
                console.log('✅ Datos después de guardar:', sellLocalService.getSellData());

                // Verificar que realmente se guardó
                const verification = sellLocalService.getSellData();
                if (!verification) {
                    console.error('❌ ERROR: Los datos NO se guardaron correctamente');
                } else {
                    console.log('✅ CONFIRMADO: Datos guardados correctamente:', verification);
                }


                return { success: true, kycUrl: null };
            }

            if (response.details === "KYC_REQUIRED") {
                sellLocalService.setSellData({
                    kycUrl: response.kycUrl,
                    destinationWalletAddress: response.destinationWalletAddress
                });
                return { success: true, kycUrl: response.kycUrl };
            }
            return { success: false, kycUrl: response.kycUrl || null };
        } catch (error) {
            console.error('Failed to create off-ramp:', error);
            return { success: false, kycUrl: null };
        }
    }

    async getQuote(data: QuoteData): Promise<{ success: boolean; cryptoAmount?: string }> {
        try {
            const response = await sellApiService.getQuote(data);

            const cryptoAmountStr = response.displayCryptoAmount.toString();
            sellLocalService.setAmountToken(cryptoAmountStr);

            // ✅ Retornar el valor obtenido
            return {
                success: true,
                cryptoAmount: cryptoAmountStr
            };
        } catch (error) {
            console.error('Failed to get quote:', error);
            return { success: false };
        }
    }



    getOffRampData(): OffRampData | null {
        return sellLocalService.getOffRampData();
    }

    setOffRampData(data: OffRampData | null): void {
        sellLocalService.setOffRampData(data);
    }

    getAmounts(): Amounts | null {
        return sellLocalService.getAmounts();
    }

    setAmounts(amounts: Amounts | null): void {
        sellLocalService.setAmounts(amounts);
    }

    getAmountFiat(): string {
        return sellLocalService.getAmountFiat() ?? '0';
    }

    getAmountToken(): string {
        return sellLocalService.getAmountToken() ?? '0';
    }

    setAmountFiat(amountFiat: string): void {
        sellLocalService.setAmountFiat(amountFiat);
    }

    setAmountToken(amountToken: string): void {
        sellLocalService.setAmountToken(amountToken);
    }

    getSellData(): SellData | null {
        return sellLocalService.getSellData();
    }

    setSellData(data: SellData | null): void {
        sellLocalService.setSellData(data);
    }
}

export default new SellRepository();