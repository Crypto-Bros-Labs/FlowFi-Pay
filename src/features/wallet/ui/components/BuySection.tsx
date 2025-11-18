import React from 'react';
import { BiMoney } from 'react-icons/bi';
import TileApp from '../../../../shared/components/TileApp';

interface BuySectionProps {
    availableBalance: number;
}

const BuySection: React.FC<BuySectionProps> = ({ availableBalance }) => {
    return (
        <div className="mb-1 px-2">
            <TileApp
                title="Saldo disponible:"
                subtitle="Pesos Mexicanos"
                leading={
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BiMoney className="w-6 h-6 text-blue-600" />
                    </div>
                }
                trailing={
                    <span className="text-base font-bold text-gray-900">
                        {availableBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                    </span>
                }
            />
        </div>
    );
};

export default BuySection;