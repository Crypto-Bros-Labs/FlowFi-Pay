import rampApiService from "../api/rampApiService";
import rampLocalService from "../local/rampLocalService";
import type { RampTransaction } from "../models/rampModel";

class RampRepository {
    async createOnRampTransaction(transaction: RampTransaction): Promise<boolean> {
        try {
            // 1. Create transaction via API
            const response = await rampApiService.createOnRampTransaction(transaction);

            // 2. Update local state
            rampLocalService.setOnRampData(
                {
                    name: 'Juan Pérez García',
                    entity: 'BBVA México',
                    clabe: response.clabe || '',
                }
            );

            return true;
        } catch (error) {
            console.error('Failed to create on-ramp transaction:', error);
            return false;
        }
    }

    clearAll(): void {
        rampLocalService.clearAll();
    }

    getOnRampData() {
        return rampLocalService.getOnRampData();
    }

    setAmounts(amounts: { amount: string; amountFiat: string } | null): void {
        rampLocalService.setAmounts(amounts);
    }

    getAmounts() {
        return rampLocalService.getAmounts();
    }

    clearAmounts(): void {
        rampLocalService.clearAmounts();
    }
}

export default new RampRepository();