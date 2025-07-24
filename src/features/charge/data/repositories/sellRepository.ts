import sellLocalService, { type Amounts } from "../local/sellLocalService";
import { sellApiService } from "../api/sellApiService";
import type { OffRampData } from "../models/sellModel";

class SellRepository {
    async createOffRamp(data: OffRampData): Promise<boolean> {
        try {
            const response = await sellApiService.createOffRamp(data);
            if (response.details === "SUCCESS") {
                sellLocalService.setSellData({
                    kycUrl: response.kycUrl,
                    destinationWalletAddress: response.destinationWalletAddress
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to create off-ramp:', error);
            return false;
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
}

export default new SellRepository();