import React from "react";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddWallet } from "../hooks/useAddWallet";

const AddWalletPage: React.FC = () => {
    const {
        address,
        handleAddressChange,
        networkOptions,
        selectedNetworkComponent,
        handleNetworkSelect,
        handleAddWallet,
        isLoading,
        error,
        isFormValid
    } = useAddWallet();

    return (
        <div className="flex flex-col h-full p-4">

            {/* Imagen placeholder */}
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>

            <DescriptionApp
                title='Agrega tu wallet'
                description='Agrega la dirección pública para agregar tu wallet'
            />

            <div className="mb-6">
                <InputApp
                    label='Dirección pública'
                    type='text'
                    placeholder='0x9Fc5b510185E7a218A2e5BD...'
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    error={error}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-[#020F1E] mb-2">
                    Red
                </label>
                <ComboBoxApp
                    options={networkOptions}
                    selectedComponent={selectedNetworkComponent}
                    onSelect={handleNetworkSelect}
                    placeholder={<span className="text-gray-500">Selecciona una red</span>}
                />
            </div>

            <div className="mt-auto mb-4">
                <ButtonApp
                    text="Agregar wallet"
                    paddingVertical="py-2"
                    textSize='text-sm'
                    isMobile={true}
                    onClick={handleAddWallet}
                    loading={isLoading}
                    loadingText='Agregando...'
                    disabled={!isFormValid || isLoading}
                />
            </div>
        </div>
    );
};

export default AddWalletPage;