import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import TileApp from '../../../../shared/components/TileApp';
import { IoCashOutline } from 'react-icons/io5';

export interface BankAccount {
    id: string;
    bankName: string;
    accountNumber?: string;
    clabe: string;
}

interface SellSectionProps {
    bankAccount?: BankAccount;
    onClick?: () => void;
}

// Formatear CLABE (18 dígitos)
const formatClabe = (clabe: string): string => {
    if (!clabe || clabe.length < 4) return '';
    const lastFour = clabe.slice(-4);
    const asterisks = '*'.repeat(8);
    return `${asterisks} ${lastFour}`;
};

const SellSection: React.FC<SellSectionProps> = ({ bankAccount, onClick }) => {
    return (
        <div className="mb-6 px-2">
            <button
                onClick={onClick}
                className="w-full text-left"
            >
                <TileApp
                    title="Depositar a:"
                    leading={
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <IoCashOutline className="w-6 h-6 text-blue-600" />
                        </div>
                    }
                    subtitle={
                        bankAccount ? (
                            <div className="flex justify-between items-center w-full gap-4">
                                <span className="text-xs font-medium text-gray-900">
                                    {bankAccount.bankName}
                                </span>
                                <span className="text-xs font-medium text-gray-600 text-right">
                                    {formatClabe(bankAccount.clabe)}
                                </span>
                            </div>
                        ) : (
                            'Seleccionar cuenta bancaria'
                        )
                    }
                    trailing={
                        <BiChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    }
                />
            </button>
        </div>
    );
};

export default SellSection;