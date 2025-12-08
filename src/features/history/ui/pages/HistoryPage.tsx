import React, { useState, useRef, useEffect } from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import { IoPerson } from "react-icons/io5";
import TileHistory from "../components/TileHistory";
import { useHistory } from "../hooks/useHistory";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";
import { formatDateRelative } from "../../../../shared/utils/dateUtils";
import { useNavigate } from "react-router-dom";
import SellInfoPanel from "../../../charge/ui/components/SellInfoPanel";
import ModalWrapper from "../../../../shared/components/ModalWrapper";

// Componente para las tarjetas de estadísticas
const StatCard: React.FC<{
    title: string;
    amountUSD?: number;
    amountMXN?: number;
    count?: number;
    isLoading: boolean;
}> = ({ title, amountUSD, amountMXN, count, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-1 mx-auto"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
            <h3 className="text-sm font-medium text-gray-600 mb-3 truncate text-center">{title}</h3>

            {count !== undefined ? (
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {count.toLocaleString()}
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                        ${amountUSD?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-gray-500">
                        ${amountMXN?.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                    </div>
                </div>
            )}
        </div>
    );
};

// Componente para los botones de filtro
const FilterButton: React.FC<{
    label: string;
    isSelected: boolean;
    onClick: () => void;
}> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`
            px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200
            ${isSelected
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
        `}
    >
        {label}
    </button>
);

const HistoryPage: React.FC = () => {
    const {
        history,
        isLoading,
        refetch,
        statistics,
        selectedFilter,
        filterOptions,
        handleFilterChange,
        cancelTransaction,
        showSellInfoModal,
        closeSellModal,
        sellInfoData,
        openSellModal,
    } = useHistory();

    const navigate = useNavigate();

    // ✅ Estados para pull-to-refresh
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Constantes para el pull-to-refresh
    const PULL_THRESHOLD = 60;
    const MAX_PULL_DISTANCE = 80;

    // ✅ Función para manejar el refresh
    const handleRefresh = React.useCallback(async () => {
        if (isRefreshing || isLoading) return;

        setIsRefreshing(true);
        try {
            await refetch();
        } finally {
            setIsRefreshing(false);
            setPullDistance(0);
        }
    }, [isRefreshing, isLoading, refetch]);

    // ✅ Event handlers usando useEffect para control completo
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (container.scrollTop === 0) {
                startY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (isRefreshing || isLoading) return;
            if (container.scrollTop > 0) return;

            const currentY = e.touches[0].clientY;
            const deltaY = currentY - startY;

            if (deltaY > 0 && container.scrollTop === 0) {
                // ✅ Ahora preventDefault funciona correctamente
                e.preventDefault();
                const distance = Math.min(deltaY * 0.5, MAX_PULL_DISTANCE);
                setPullDistance(distance);
            }
        };

        const handleTouchEnd = () => {
            if (pullDistance >= PULL_THRESHOLD) {
                handleRefresh();
            } else {
                setPullDistance(0);
            }
        };

        // ✅ Agregar listeners con { passive: false }
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false }); // ← Clave aquí
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        // ✅ Cleanup
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isRefreshing, isLoading, pullDistance, PULL_THRESHOLD, MAX_PULL_DISTANCE, handleRefresh]);

    return (
        <div className="flex flex-col h-full">
            <AppHeader
                rightActions={[
                    {
                        icon: IoPerson,
                        onClick: () => navigate('/profile'),
                        className: 'text-gray-700'
                    }
                ]}
            />

            {/* Tarjetas de estadísticas */}
            <div className="px-4 mt-4 mb-4">
                <div className="flex gap-3">
                    <StatCard
                        title="Total de transacciones"
                        count={statistics.totalTransactions}
                        isLoading={isLoading && !isRefreshing}
                    />
                    <StatCard
                        title="Total recibido"
                        amountUSD={statistics.totalReceivedUSD}
                        amountMXN={statistics.totalReceivedMXN}
                        isLoading={isLoading && !isRefreshing}
                    />
                </div>
            </div>

            {/* Sección de filtros */}
            <div className="px-4 mb-4">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {filterOptions.map((option) => (
                        <FilterButton
                            key={option.key}
                            label={option.label}
                            isSelected={selectedFilter === option.key}
                            onClick={() => handleFilterChange(option.key)}
                        />
                    ))}
                </div>
            </div>

            <div
                ref={containerRef}
                className="flex-1 flex px-4 overflow-y-auto flex-col gap-4 relative"
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: pullDistance > 0 && !isRefreshing ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                {/* ✅ Pull-to-refresh indicator */}
                {(pullDistance > 0 || isRefreshing) && (
                    <div
                        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center bg-white z-10"
                        style={{
                            height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
                            transform: `translateY(-${Math.max(pullDistance, isRefreshing ? 60 : 0)}px)`,
                            opacity: Math.min(pullDistance / PULL_THRESHOLD, 1)
                        }}
                    >
                        <div className="flex flex-col items-center justify-center py-2">
                            {isRefreshing ? (
                                <>
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-1"></div>
                                    <span className="text-xs text-blue-600 font-medium">Actualizando...</span>
                                </>
                            ) : pullDistance >= PULL_THRESHOLD ? (
                                <>
                                    <div className="w-6 h-6 text-green-600 mb-1">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-green-600 font-medium">Suelta para actualizar</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-6 h-6 text-gray-400 mb-1">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">Desliza hacia abajo</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ✅ Loading state */}
                {isLoading && !isRefreshing && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Cargando historial...</p>
                        </div>
                    </div>
                )}

                {/* ✅ Empty state */}
                {!isLoading && history.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin transacciones</h3>
                        <p className="text-sm text-gray-500 text-center">
                            No hay transacciones para el período seleccionado
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            Recargar
                        </button>
                    </div>
                )}

                {/* ✅ History list */}
                {!isLoading && history.length > 0 && history.map((transaction) => {
                    // ✅ Determinar qué ID usar según el tipo de transacción
                    const transactionId = 'id' in transaction
                        ? transaction.id
                        : 'orderUuid' in transaction
                            ? transaction.orderUuid
                            : 'unknown';

                    return (
                        'id' in transaction ?
                            <TileHistory
                                key={transaction.createdAt}
                                status={parseTransactionStatus(transaction.status!)}
                                amount={Number(transaction.cryptoAmount)}
                                id={transactionId}
                                onCancelTransaction={cancelTransaction}
                                subtitle={formatDateRelative(transaction.createdAt)}
                            /> :
                            <TileHistory
                                key={transaction.createdAt}
                                status={parseTransactionStatus(transaction.status!)}
                                amount={Number(transaction.cryptoAmount)}
                                id={transactionId}
                                onCancelTransaction={cancelTransaction}
                                subtitle={formatDateRelative(transaction.createdAt)}
                                onClick={() => openSellModal(
                                    {
                                        amountFiat: transaction.FiatCurrencyAmount,
                                        amountToken: transaction.cryptoAmount,
                                        tokenSymbol: transaction.TokenSymbol,
                                        networkName: transaction.network,
                                        orderId: transaction.orderUuid
                                    }
                                )}
                            />
                    );
                })}
            </div>

            {showSellInfoModal && (
                <ModalWrapper onClose={closeSellModal}>
                    <SellInfoPanel onClose={closeSellModal} onContinue={closeSellModal} sellInfoData={sellInfoData} />
                </ModalWrapper>
            )}
        </div>
    );
}

export default HistoryPage;