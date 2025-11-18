import React from 'react';

interface AvailableCryptoSectionProps {
    name: string;
    amount: number;
    symbol: string;
}

const AvailableCryptoSection: React.FC<AvailableCryptoSectionProps> = ({
    name,
    amount,
    symbol
}) => {
    return (
        <div className="text-center mb-4 px-4">
            <p className="text-sm font-medium text-gray-600 mb-1">
                {name} Disponible:
            </p>
            <div className="flex items-center justify-center gap-2">
                <span className="text-base font-semibold text-gray-900">
                    {amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {symbol}
                </span>
            </div>
        </div>
    );
};

export default AvailableCryptoSection;