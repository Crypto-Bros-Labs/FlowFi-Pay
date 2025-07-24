import React, { useState, useRef, useEffect } from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import { IoPerson } from "react-icons/io5";
import TileHistory from "../components/TileHistory";
import { useHistory } from "../hooks/useHistory";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";
import { formatDateRelative } from "../../../../shared/utils/dateUtils";

const HistoryPage: React.FC = () => {
    const { history, isLoading, refetch } = useHistory();

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
                        onClick: () => console.log('Profile clicked'),
                        className: 'text-gray-700'
                    }
                ]}
            />

            <div
                ref={containerRef}
                className="flex-1 flex px-4 mt-4 overflow-y-auto flex-col gap-4 relative"
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin historial</h3>
                        <p className="text-sm text-gray-500 text-center">
                            Aún no tienes transacciones registradas
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
                {!isLoading && history.length > 0 && history.map((transaction) => (
                    <TileHistory
                        key={transaction.createdAt}
                        status={parseTransactionStatus(transaction.status)}
                        amount={Number(transaction.cryptoAmount)}
                        subtitle={formatDateRelative(transaction.createdAt)}
                    />
                ))}
            </div>
        </div>
    );
}

export default HistoryPage;