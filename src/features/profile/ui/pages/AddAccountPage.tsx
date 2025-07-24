import React from "react";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddAccount } from "../hooks/useAddAccount";
import AppHeader from "../../../../shared/components/AppHeader";

const AddAccountPage: React.FC = () => {
    const {
        clabe,
        formattedClabe,
        handleClabeChange,
        bankOptions,
        selectedBankComponent,
        handleBankSelect,
        handleAddAccount,
        isLoading,
        error,
        isFormValid
    } = useAddAccount();

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader title="Agregar Cuenta" />

            {/* Imagen placeholder */}
            <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-6 mt-6 flex items-center justify-center border-2 border-blue-100">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            </div>

            <DescriptionApp
                title='Agrega tu CLABE'
                description='Agrega tu cuenta de banco solo con tu CLABE'
            />

            <div className="mb-6">
                <InputApp
                    label='CLABE'
                    type='text'
                    placeholder='1234 5678 9012 3456 78'
                    value={formattedClabe}
                    onChange={(e) => handleClabeChange(e.target.value)}
                    error={error}
                />
                <div className="text-xs text-gray-500 mt-1">
                    {clabe.length}/18 dígitos
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-[#020F1E] mb-2">
                    Banco
                </label>
                <ComboBoxApp
                    disabled={true}
                    options={bankOptions}
                    selectedComponent={selectedBankComponent}
                    onSelect={handleBankSelect}
                    placeholder={<span className="text-gray-500">Completa tu CLABE</span>}
                />
            </div>

            <div className="mt-auto mb-4">
                <ButtonApp
                    text="Agregar cuenta"
                    paddingVertical="py-2"
                    textSize='text-sm'
                    isMobile={true}
                    onClick={handleAddAccount}
                    loading={isLoading}
                    loadingText='Agregando...'
                    disabled={!isFormValid || isLoading}
                />
            </div>
        </div>
    );
};

export default AddAccountPage;