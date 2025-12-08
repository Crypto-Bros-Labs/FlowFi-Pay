import { axiosWithAuthInstance, publicAxiosInstance } from "../../../../shared/api/axiosService";
import type { RecoveryOrderModel } from "../../../history/data/models/historyModel";
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

    async createRecoveryOrdder(recoveryOrder: RecoveryOrderData): Promise<{ success: boolean, orderUuid: string }> {
        const response = await axiosWithAuthInstance.post("/transactions/charging-order", recoveryOrder);
        return { success: response.data.success, orderUuid: response.data.data };
    }

    async getRecoveryOrderById(orderId: string): Promise<RecoveryOrderModel> {
        const response = await publicAxiosInstance.get(`/transactions/charging-order/${orderId}`);
        return response.data.data as RecoveryOrderModel;
    }
}

export const sellApiService = new SellApiService();