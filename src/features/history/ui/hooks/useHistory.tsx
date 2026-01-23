import type {
  WithdrawalOrderModel,
  DepositOrderModel,
  RecoveryOrderModel,
} from "../../data/models/historyModel";
import historyRepository from "../../data/repositories/historyRepository";
import userRepository from "../../../login/data/repositories/userRepository";
import { useEffect, useState, useMemo } from "react";
import type { SellInfoData } from "../../../charge/ui/components/SellInfoPanel";
import type { TransactionStatus } from "../components/TileHistory";

export interface WithdrawalInfoData {
  amountFiat: string;
  amountToken: string;
  tokenSymbol: string;
  networkName: string;
  orderId: string;
  transactionId: string;
  walletAddress: string;
  name: string;
  status: TransactionStatus;
}

export interface DepositInfoData {
  amountFiat: string;
  amountToken: string;
  tokenSymbol: string;
  networkName: string;
  orderId: string;
  transactionId: string;
  clabe: string;
  name: string;
  status: TransactionStatus;
}

// Tipos para los filtros - agregamos 'all' como opción
export type FilterPeriod =
  | "all"
  | "today"
  | "thisWeek"
  | "thisMonth"
  | "lastMonth";

export const useHistory = () => {
  const [history, setHistory] = useState<
    (WithdrawalOrderModel | DepositOrderModel | RecoveryOrderModel)[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterPeriod>("all");
  const [showSellInfoModal, setShowSellInfoModal] = useState<boolean>(false);
  const [sellInfoData, setSellInfoData] = useState<SellInfoData | undefined>(
    undefined,
  );
  const [showWithdrawalInfoModal, setShowWithdrawalInfoModal] =
    useState<boolean>(false);
  const [withdrawalInfoData, setWithdrawalInfoData] = useState<
    WithdrawalInfoData | undefined
  >(undefined);

  const [showDepositInfoModal, setShowDepositInfoModal] =
    useState<boolean>(false);
  const [depositInfoData, setDepositInfoData] = useState<
    DepositInfoData | undefined
  >(undefined);

  // Constante para la conversión USD a MXN
  const USD_TO_MXN_RATE = 18.39;

  // Opciones de filtros - agregamos opción "Todos"
  const filterOptions = [
    { key: "all" as FilterPeriod, label: "Todos" }, // ✅ Nueva opción
    { key: "today" as FilterPeriod, label: "Hoy" },
    { key: "thisWeek" as FilterPeriod, label: "Esta semana" },
    { key: "thisMonth" as FilterPeriod, label: "Este mes" },
    { key: "lastMonth" as FilterPeriod, label: "Mes pasado" },
  ];

  const openSellModal = (sellData: SellInfoData) => {
    setSellInfoData(sellData);
    setShowSellInfoModal(true);
  };
  const closeSellModal = () => setShowSellInfoModal(false);

  const openWithdrawalModal = (withdrawalData: WithdrawalInfoData) => {
    setWithdrawalInfoData(withdrawalData);
    setShowWithdrawalInfoModal(true);
  };

  const closeWithdrawalModal = () => setShowWithdrawalInfoModal(false);

  const openDepositModal = (depositData: DepositInfoData) => {
    setDepositInfoData(depositData);
    setShowDepositInfoModal(true);
  };

  const closeDepositModal = () => setShowDepositInfoModal(false);

  // Función para obtener el rango de fechas según el filtro
  const getDateRange = (filter: FilterPeriod) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
      case "all": // ✅ Nuevo caso
        return null; // Retornamos null para indicar "sin filtro"

      case "today": {
        const endOfToday = new Date(today);
        endOfToday.setHours(23, 59, 59, 999);
        return { start: today, end: endOfToday };
      }

      case "thisWeek": {
        const startOfWeek = new Date(today);
        const dayOfWeek = startOfWeek.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Lunes como primer día
        startOfWeek.setDate(startOfWeek.getDate() - diff);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return { start: startOfWeek, end: endOfWeek };
      }

      case "thisMonth": {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        return { start: startOfMonth, end: endOfMonth };
      }

      case "lastMonth": {
        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
        );
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

    return history.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      return transactionDate >= start && transactionDate <= end;
    });
  }, [history, selectedFilter]);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userUuid =
        (await userRepository.getCurrentUserData())?.userUuid || "default-uuid";
      const historyData = await historyRepository.getHistory(userUuid);

      if (historyData.success) {
        const chargingOrdersWithStatus = (
          historyData.data?.chargingOrders || []
        ).map((order) => ({
          ...order,
          status: "order",
        }));
        // Combinar y ordenar por fecha (más reciente primero)
        const combinedHistory = [
          ...chargingOrdersWithStatus,
          ...(historyData.data?.withdrawalOrders || []),
          ...(historyData.data?.depositOrders || []),
        ].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // Más reciente primero (descendente)
        });

        setHistory(combinedHistory);
      } else {
        setError(historyData.error || "Error al cargar el historial");
        console.error("Failed to fetch history:", historyData.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar el historial";
      setError(errorMessage);
      console.error("Error fetching history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelTransaction = async (transactionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await historyRepository.cancelTransaction(transactionId);
      if (result.success) {
        // Refrescar el historial después de cancelar
        await fetchHistory();
      } else {
        setError(result.error || "Error al cancelar la transacción");
        console.error("Failed to cancel transaction:", result.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cancelar la transacción";
      setError(errorMessage);
      console.error("Error cancelling transaction:", err);
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
    const receivedTransactions = filteredHistory.filter(
      (transaction): transaction is DepositOrderModel | RecoveryOrderModel => {
        return (
          "status" in transaction &&
          (transaction.status?.toLowerCase() === "received" ||
            transaction.status?.toLowerCase() === "completed")
        );
      },
    );

    const totalReceivedUSD = receivedTransactions.reduce((sum, transaction) => {
      return sum + (Number(transaction.cryptoAmount) || 0);
    }, 0);

    // Convertir a MXN
    const totalReceivedMXN = totalReceivedUSD * USD_TO_MXN_RATE;

    return {
      totalTransactions,
      totalReceivedUSD,
      totalReceivedMXN,
      receivedTransactionsCount: receivedTransactions.length,
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
    cancelTransaction,

    // Nuevas estadísticas (basadas en el filtro)
    statistics,
    usdToMxnRate: USD_TO_MXN_RATE,

    // Nuevas propiedades para filtros
    selectedFilter,
    filterOptions,
    handleFilterChange,

    // Propiedades para el modal de información de venta
    showSellInfoModal,
    openSellModal,
    closeSellModal,
    sellInfoData,

    withdrawalInfoData,
    showWithdrawalInfoModal,
    openWithdrawalModal,
    closeWithdrawalModal,

    depositInfoData,
    showDepositInfoModal,
    openDepositModal,
    closeDepositModal,
  };
};
