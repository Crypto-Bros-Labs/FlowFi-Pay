import { axiosInstance } from "../../../../shared/api/axiosService";
import type { RampTransaction, OnRampData } from "../models/rampModel";

class RampApiService {
    async createOnRampTransaction(transaction: RampTransaction): Promise<OnRampData> {
        const response = await axiosInstance.post('/flow/on-ramp', transaction);
        return response.data.data;
    }
}

export default new RampApiService();