import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../../../shared/components/AppHeader";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useBankAccounts } from "../hooks/useBankAccounts";
import BankTile from "../components/BankTile";

const BankAccountsPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        bankAccounts,
        isAccountOptionsLoading,
        isDeletingBank,
        selectedBankAccount,
        handleSelectBank,
        handleDeleteBank,
    } = useBankAccounts();

    const handleAddBank = () => {
        navigate('/add-account');
    };

    if (isAccountOptionsLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando cuentas...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader
                title="Cuentas bancarias"
                onBack={() => navigate('/profile')}
            />

            {/* Lista de cuentas bancarias */}
            <div className="flex-1 overflow-y-auto mt-6">
                {bankAccounts && bankAccounts.length > 0 ? (
                    <div className="space-y-3">
                        {bankAccounts.map((bank) => (
                            <BankTile
                                key={bank.id}
                                id={bank.id}
                                bankName={bank.bankName}
                                accountNumber={bank.accountNumber}
                                isModificable={true}
                                isSelected={selectedBankAccount === bank.id}
                                onClick={() => handleSelectBank(bank.id)}
                                onDelete={handleDeleteBank}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Sin cuentas bancarias
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Agrega una cuenta bancaria para recibir pagos
                        </p>
                    </div>
                )}
            </div>

            {/* Botón agregar (fijo abajo) */}
            <div className="flex-shrink-0 mt-4 p-2">
                <ButtonApp
                    text="Agregar cuenta bancaria"
                    paddingVertical="py-2"
                    textSize="text-base"
                    isMobile={true}
                    onClick={handleAddBank}
                    disabled={isDeletingBank}
                />
            </div>
        </div>
    );
};

export default BankAccountsPage;