import { axiosInstance } from "../../../../shared/api/axiosService";
import type { HistoryResponse } from "../models/historyModel";

class HistoryApiService {
  async getHistory(userUuid: string): Promise<HistoryResponse> {
    try {
      const response = await axiosInstance.get(
        `/transactions/user/${userUuid}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching history:", error);
      throw error;
    }
  }

  async cancelTransaction(
    transactionId: string,
    transactionType: string,
  ): Promise<boolean> {
    try {
      await axiosInstance.get(`/transactions/${transactionId}/cancel`, {
        params: {
          transactionType,
        },
      });
      return true;
    } catch (error) {
      console.error("Error cancelling transaction:", error);
      return false;
    }
  }
}

export default new HistoryApiService();
