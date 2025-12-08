import sellLocalService, { type Amounts, type SellData } from "../local/sellLocalService";
import { sellApiService } from "../api/sellApiService";
import type { OffRampData, OffRampResponse, QuoteData, RecoveryOrderData } from "../models/sellModel";
import { AxiosError } from "axios";
import type { RecoveryOrderModel } from "../../../history/data/models/historyModel";

class SellRepository {
    async createOffRamp(data: OffRampData): Promise<{ success: boolean, kycUrl: string | null, status: string | null }> {
        try {
            const response = await sellApiService.createOffRamp(data);
            console.log('📨 API Response completa:', response);
            if (response.kycStatus === "APPROVED") {
                if (response.successTransfer) {
                    return { success: true, kycUrl: null, status: response.kycStatus };
                } else {
                    return { success: false, kycUrl: null, status: response.kycStatus };
                }
            } else {
                return { success: false, kycUrl: response.kycUrl, status: response.kycStatus };
            }
        } catch (error) {
            console.error('Failed to create off-ramp:', error);
            // Narrow the AxiosError type to include the expected response shape
            const axiosErr = error as AxiosError<{ data: OffRampResponse }>;
            if (axiosErr.response?.status === 403) {
                const response = axiosErr.response;
                const data = response?.data?.data as OffRampResponse | undefined;
                if (data && data.kycStatus === "APPROVED") {
                    if (data.successTransfer) {
                        return { success: true, kycUrl: null, status: data.kycStatus };
                    } else {
                        return { success: false, kycUrl: null, status: data.kycStatus };
                    }
                } else if (data) {
                    return { success: false, kycUrl: data.kycUrl, status: data.kycStatus };
                } else {
                    return { success: false, kycUrl: null, status: null };
                }
            } else {
                return { success: false, kycUrl: null, status: null };
            }
        }
    }

    async createRecoveryOrder(recoveryOrder: RecoveryOrderData): Promise<{ success: boolean, orderUuid: string }> {
        try {
            const response = await sellApiService.createRecoveryOrdder(recoveryOrder);
            return { success: response.success, orderUuid: response.orderUuid };
        } catch (error) {
            console.error('Failed to create recovery order:', error);
            return { success: false, orderUuid: '' };
        }
    }

    async getRecoveryOrderById(orderId: string): Promise<RecoveryOrderModel> {
        try {
            const recoveryOrder = await sellApiService.getRecoveryOrderById(orderId);
            return recoveryOrder;
        } catch (error) {
            console.error('Failed to get recovery order by ID:', error);
            throw error;
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