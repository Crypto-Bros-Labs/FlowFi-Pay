import type { HistoryResponse } from "../../data/models/historyModel";
import historyRepository from "../../data/repositories/historyRepository";
import userRepository from "../../../login/data/repositories/userRepository";
import { useEffect, useState, useMemo } from "react";

// Tipos para los filtros - agregamos 'all' como opción
export type FilterPeriod = 'all' | 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth';

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<FilterPeriod>('all'); // ✅ Cambiado a 'all'

    // Constante para la conversión USD a MXN
    const USD_TO_MXN_RATE = 18.39;

    // Opciones de filtros - agregamos opción "Todos"
    const filterOptions = [
        { key: 'all' as FilterPeriod, label: 'Todos' }, // ✅ Nueva opción
        { key: 'today' as FilterPeriod, label: 'Hoy' },
        { key: 'thisWeek' as FilterPeriod, label: 'Esta semana' },
        { key: 'thisMonth' as FilterPeriod, label: 'Este mes' },
        { key: 'lastMonth' as FilterPeriod, label: 'Mes pasado' }
    ];

    // Función para obtener el rango de fechas según el filtro
    const getDateRange = (filter: FilterPeriod) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (filter) {
            case 'all': // ✅ Nuevo caso
                return null; // Retornamos null para indicar "sin filtro"

            case 'today':
                {
                    const endOfToday = new Date(today);
                    endOfToday.setHours(23, 59, 59, 999);
                    return { start: today, end: endOfToday };
                }

            case 'thisWeek':
                {
                    const startOfWeek = new Date(today);
                    const dayOfWeek = startOfWeek.getDay();
                    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Lunes como primer día
                    startOfWeek.setDate(startOfWeek.getDate() - diff);

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(endOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    return { start: startOfWeek, end: endOfWeek };
                }

            case 'thisMonth':
                {
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                    endOfMonth.setHours(23, 59, 59, 999);
                    return { start: startOfMonth, end: endOfMonth };
                }

            case 'lastMonth':
                {
                    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                    endOfLastMonth.setHours(23, 59, 59, 999);
                    return { start: startOfLastMonth, end: endOfLastMonth };
                }

            default:
                return null; // ✅ Por defecto sin filtro
        }
    };

    // Filtrar historial según el período seleccionado
    const filteredHistory = useMemo(() => {
        const dateRange = getDateRange(selectedFilter);

        // ✅ Si no hay rango (filtro 'all'), devolvemos todo el historial
        if (!dateRange) {
            return history;
        }

        const { start, end } = dateRange;

        return history.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            return transactionDate >= start && transactionDate <= end;
        });
    }, [history, selectedFilter]);

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

    // Cálculos de estadísticas usando el historial filtrado
    const statistics = useMemo(() => {
        const totalTransactions = filteredHistory.length;

        // Filtrar transacciones con status "received" del historial filtrado
        const receivedTransactions = filteredHistory.filter(transaction =>
            transaction.status.toLowerCase() === 'received' ||
            transaction.status.toLowerCase() === 'completed' ||
            transaction.status.toLowerCase() === 'success'
        );

        // Sumar el total de transacciones recibidas en USD
        const totalReceivedUSD = receivedTransactions.reduce((sum, transaction) => {
            return sum + (Number(transaction.cryptoAmount) || 0);
        }, 0);

        // Convertir a MXN
        const totalReceivedMXN = totalReceivedUSD * USD_TO_MXN_RATE;

        return {
            totalTransactions,
            totalReceivedUSD,
            totalReceivedMXN,
            receivedTransactionsCount: receivedTransactions.length
        };
    }, [filteredHistory, USD_TO_MXN_RATE]);

    // Función para cambiar el filtro
    const handleFilterChange = (filter: FilterPeriod) => {
        setSelectedFilter(filter);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        history: filteredHistory, // Devolvemos el historial filtrado
        isLoading,
        error,
        refetch: fetchHistory,
        retry: retryFetch,
        clearError,

        // Nuevas estadísticas (basadas en el filtro)
        statistics,
        usdToMxnRate: USD_TO_MXN_RATE,

        // Nuevas propiedades para filtros
        selectedFilter,
        filterOptions,
        handleFilterChange
    };
};