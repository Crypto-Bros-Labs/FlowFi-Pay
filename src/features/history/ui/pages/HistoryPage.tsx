import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import { IoPerson } from "react-icons/io5";
import TileHistory from "../components/TileHistory";
import { useHistory } from "../hooks/useHistory";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";

const HistoryPage: React.FC = () => {
    const { history, isLoading } = useHistory();

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

            <div className="flex-1 flex px-4 mt-4 overflow-y-auto flex-col gap-4">
                {/* ✅ Loading state */}
                {isLoading && (
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
                    </div>
                )}

                {/* ✅ History list */}
                {!isLoading && history.length > 0 && history.map((transaction) => (
                    <TileHistory
                        key={transaction.createdAt}
                        status={parseTransactionStatus(transaction.status)}
                        amount={Number(transaction.fiatAmount)}
                        subtitle={transaction.createdAt}
                    />
                ))}
            </div>
        </div>
    );
}

export default HistoryPage;