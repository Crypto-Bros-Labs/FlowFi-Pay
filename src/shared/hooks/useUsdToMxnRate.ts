import { useEffect, useState, useCallback } from 'react';
import sellRepository from '../../features/charge/data/repositories/sellRepository';

interface UseUsdToMxnRateReturn {
    rate: number | null;
    isLoading: boolean;
    error: string | null;
    refreshRate: () => void;
}

export const useUsdToMxnRate = (autoRefresh: boolean = true): UseUsdToMxnRateReturn => {
    const [rate, setRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRate = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const fetchedRate = await sellRepository.getUsdToMxnRate();

            if (fetchedRate !== null) {
                setRate(fetchedRate);
            } else {
                setError('No se pudo obtener la tasa de cambio');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al obtener la tasa';
            setError(errorMessage);
            console.error('Error fetching USD to MXN rate:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!autoRefresh) return;

        fetchRate();

        const intervalId = setInterval(() => {
            fetchRate();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [autoRefresh, fetchRate]);

    const refreshRate = useCallback(() => {
        fetchRate();
    }, [fetchRate]);

    return {
        rate,
        isLoading,
        error,
        refreshRate,
    };
};