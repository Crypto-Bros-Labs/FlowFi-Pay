import React from 'react';
import { FaClock } from 'react-icons/fa';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';

type TransactionStatus = 'completed' | 'pending' | 'canceled';

interface TileHistoryProps {
    status: TransactionStatus;
    amount: number;
    subtitle?: string;
}

const TileHistory: React.FC<TileHistoryProps> = ({
    status,
    amount,
    subtitle = "Transferencia"
}) => {
    // Configuración por estado
    const getStatusConfig = (status: TransactionStatus) => {
        switch (status) {
            case 'completed':
                return {
                    leadingBg: 'bg-green-100',
                    leadingIcon: IoCheckmarkCircleOutline,
                    iconColor: 'text-[#00A855]',
                    title: 'Received',
                    chipBg: 'bg-green-100',
                    chipText: 'text-green-700',
                    chipLabel: 'Completed'
                };
            case 'pending':
                return {
                    leadingBg: 'bg-yellow-100',
                    leadingIcon: FaClock,
                    iconColor: 'text-orange-600',
                    title: 'Incoming',
                    chipBg: 'bg-yellow-100',
                    chipText: 'text-yellow-700',
                    chipLabel: 'Pending'
                };
            case 'canceled':
                return {
                    leadingBg: 'bg-red-200',
                    leadingIcon: IoCloseCircleOutline,
                    iconColor: 'text-red-600',
                    title: 'Not Received',
                    chipBg: 'bg-red-100',
                    chipText: 'text-red-700',
                    chipLabel: 'Canceled'
                };
            default:
                return {
                    leadingBg: 'bg-gray-200',
                    leadingIcon: IoCheckmarkCircleOutline,
                    iconColor: 'text-gray-600',
                    title: 'Unknown',
                    chipBg: 'bg-gray-100',
                    chipText: 'text-gray-700',
                    chipLabel: 'Unknown'
                };
        }
    };

    const config = getStatusConfig(status);
    const IconComponent = config.leadingIcon;

    // Formatear amount
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                {/* Leading - Icon Circle */}
                <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-full ${config.leadingBg} flex items-center justify-center mr-4`}>
                        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                    </div>

                    {/* Title and Subtitle */}
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900">
                            {config.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Trailing - Amount and Status Chip */}
                <div className="flex flex-col items-end">
                    {/* Amount */}
                    <span className="text-lg font-semibold text-gray-900 mb-1">
                        {formatAmount(amount)}
                    </span>

                    {/* Status Chip */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.chipBg} ${config.chipText}`}>
                        {config.chipLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TileHistory;