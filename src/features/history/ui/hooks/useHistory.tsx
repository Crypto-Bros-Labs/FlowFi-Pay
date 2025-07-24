import type { HistoryResponse } from "../../data/models/historyModel";
import historyRepository from "../../data/repositories/historyRepository";
import userRepository from "../../../login/data/repositories/userRepository";
import { useEffect, useState } from "react";

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';
            const historyData = await historyRepository.getHistory(userUuid);

            if (historyData.success) {
                setHistory(historyData.data || []);
            } else {
                setError(historyData.error || 'Error al cargar el historial');
                console.error('Failed to fetch history:', historyData.error);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar el historial';
            setError(errorMessage);
            console.error('Error fetching history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const retryFetch = () => {
        fetchHistory();
    };

    const clearError = () => {
        setError(null);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        history,
        isLoading,
        error,
        refetch: fetchHistory,
        retry: retryFetch,
        clearError,
    };
};