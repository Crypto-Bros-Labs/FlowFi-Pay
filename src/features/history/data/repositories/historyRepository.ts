import historyApiService from "../api/historyApiService";
import type { HistoryResponse } from "../models/historyModel";

class HistoryRepository {
    async getHistory(userUuid: string): Promise<{ success: boolean, data?: HistoryResponse[], error?: string }> {
        try {
            const history = await historyApiService.getHistory(userUuid);
            return { success: true, data: history };
        } catch (error) {
            console.error('Error fetching history:', error);
            return { success: false, error: 'Error fetching history' };
        }
    }

    async cancelTransaction(transactionId: string): Promise<{ success: boolean, error?: string }> {
        try {
            const result = await historyApiService.cancelTransaction(transactionId);
            if (result) {
                return { success: true };
            } else {
                return { success: false, error: 'Error cancelling transaction' };
            }
        } catch (error) {
            console.error('Error cancelling transaction:', error);
            return { success: false, error: 'Error cancelling transaction' };
        }
    }
}

export default new HistoryRepository();