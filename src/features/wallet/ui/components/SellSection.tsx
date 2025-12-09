import React from 'react';
import { useAccountOptions } from '../../../../shared/hooks/useAccountOptions';
import ComboBoxApp from '../../../../shared/components/ComboBoxApp';

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



const SellSection: React.FC<SellSectionProps> = ({ onClick }) => {

    const {
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect,
        handleAddBank,
    } = useAccountOptions();

    return (
        <div className="px-2">
            <button
                onClick={onClick}
                className="w-full text-left"

            >

                <div className="mb-6 px-2">
                    <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                        Cuenta a depositar:
                    </div>

                    {bankAccounts && bankAccounts.length > 0 ? (
                        <ComboBoxApp
                            options={bankComboBoxOptions}
                            selectedId={selectedBankAccount}
                            onSelect={onBankSelect}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={handleAddBank}
                            className={`
                        w-full p-2.5 flex items-center justify-center gap-3
                        border border-[#666666] rounded-[10px]
                        bg-white text-left
                        transition-all duration-200 ease-in-out
                        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        cursor-pointer
                    `}
                        >
                            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-sm font-bold text-[#020F1E] mt-0.75">
                                Agregar cuenta de banco
                            </span>
                        </button>
                    )}
                </div>
                {/* 
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
                */}
            </button>
        </div>
    );
};

export default SellSection;