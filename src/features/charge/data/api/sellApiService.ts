import { axiosWithAuthInstance } from "../../../../shared/api/axiosService";
import type { OffRampData, OffRampResponse, QuoteData, QuoteResponse } from "../models/sellModel";

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
}

export const sellApiService = new SellApiService();