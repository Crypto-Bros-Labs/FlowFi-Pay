import { axiosInstance } from "../../../../shared/api/axiosService";
import type { OffRampData, OffRampResponse } from "../models/sellModel";

class SellApiService {
    async createOffRamp(data: OffRampData): Promise<OffRampResponse> {
        const response = await axiosInstance.post("/off-ramp", data);
        return response.data;
    }

}

export const sellApiService = new SellApiService();