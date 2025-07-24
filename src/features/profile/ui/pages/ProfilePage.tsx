import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import blueUser from '/illustrations/blueuser.png';
import TileApp from "../../../../shared/components/TileApp";
import { BiChevronRight } from "react-icons/bi";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";


const ProfilePage: React.FC = () => {
    const {
        walletAddresses,
        walletComboBoxOptions,
        selectedWalletAddress,
        onWalletSelect,
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect,
        isAccountOptionsLoading,
        handleAddBank,
    } = useAccountOptions();

    if (isAccountOptionsLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader title="Perfil" />

            {/* Imagen placeholder */}
            <div className="w-30 h-30 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center mt-4">
                <img src={blueUser} alt="User Icon" className="w-full h-full" />
            </div>

            <div className="flex flex-col p-2 mt-2">
                <TileApp
                    title="Moneda a cobrar"
                    titleSize="lg"
                    disabled={true}
                    trailing={
                        <div className="flex items-center gap-1">
                            <span className="text-base font-medium text-[#666666]">MXN</span>
                            <BiChevronRight className="w-8 h-8" />
                        </div>
                    }
                />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mx-2 my-4"></div>

            <div className="mb-6 px-2">
                <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                    Wallet
                </div>

                {walletAddresses && walletAddresses.length > 0 ? (
                    <ComboBoxApp
                        options={walletComboBoxOptions}
                        selectedId={selectedWalletAddress}
                        onSelect={onWalletSelect}
                        disabled={true}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={() => console.log('Agregar wallet')}
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
                            Agregar wallet
                        </span>
                    </button>
                )}
            </div>

            <div className="mb-6 px-2">
                <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                    Cuenta bancaria
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
        </div>
    );
};

export default ProfilePage;
