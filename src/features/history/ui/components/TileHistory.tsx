import React, { useState, useRef, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { HiEllipsisVertical } from 'react-icons/hi2';

export type TransactionStatus = 'completed' | 'pending' | 'canceled';

interface TileHistoryProps {
    status: TransactionStatus;
    amount: number;
    id: string;
    subtitle?: string;
    onCancelTransaction?: (id: string) => void;
}

const TileHistory: React.FC<TileHistoryProps> = ({
    status,
    amount,
    id,
    subtitle = "Transferencia",
    onCancelTransaction
}) => {
    // ✅ Estado para el menú desplegable
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    // ✅ Cerrar menú al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    // ✅ Manejar cancelación de transacción
    const handleCancelClick = () => {
        if (onCancelTransaction) {
            onCancelTransaction(id);
        }
        setIsMenuOpen(false);
    };

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
                        <p className="text-xs text-gray-500 mt-1">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Trailing - Amount and Status Chip */}
                <div className="flex flex-col items-end gap-2">
                    {/* Amount */}
                    <span className="text-lg font-semibold text-gray-900">
                        {formatAmount(amount)}
                    </span>

                    <div className="flex items-center gap-3">
                        {/* Status Chip */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.chipBg} ${config.chipText}`}>
                            {config.chipLabel}
                        </span>

                        {/* ✅ Menú de opciones - Solo para pending */}
                        {status === 'pending' && (
                            <div className="relative" ref={menuRef}>
                                {/* Botón de opciones */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Más opciones"
                                >
                                    <HiEllipsisVertical className="w-5 h-5 text-gray-600" />
                                </button>

                                {/* ✅ Menú desplegable */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[180px] overflow-hidden">
                                        {/* Opción cancelar */}
                                        <button
                                            onClick={handleCancelClick}
                                            className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                        >
                                            <IoCloseCircleOutline className="w-4 h-4" />
                                            Cancelar transacción
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TileHistory;