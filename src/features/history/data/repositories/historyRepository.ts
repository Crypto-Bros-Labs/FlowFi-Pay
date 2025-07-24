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
}

export default new HistoryRepository();