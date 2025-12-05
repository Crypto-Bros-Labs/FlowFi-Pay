import { axiosWithAuthInstance } from "../../../../shared/api/axiosService";
import type { OffRampData, OffRampResponse, QuoteData, QuoteResponse, RecoveryOrderData } from "../models/sellModel";

class SellApiService {
    async createOffRamp(data: OffRampData): Promise<OffRampResponse> {
        const response = await axiosWithAuthInstance.post("/flow/off-ramp", data);
        return response.data.data;
    }

    async getQuote(data: QuoteData): Promise<QuoteResponse> {
        const response = await axiosWithAuthInstance.get(`/flow/off-ramp/quoting/${data.providerUuid}`, {
            params: {
                from: data.fromUuuid,
                to: data.toUuid,
                amount: data.amountFiat
            }
        });
        return response.data.data;
    }

    async createRecoveryOrdder(recoveryOrder: RecoveryOrderData): Promise<boolean> {
        const response = await axiosWithAuthInstance.post("/transactions/charging-order", recoveryOrder);
        return response.data.success;
    }
}

export const sellApiService = new SellApiService();