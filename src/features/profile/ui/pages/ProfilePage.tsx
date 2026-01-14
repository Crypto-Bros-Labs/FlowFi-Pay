import React, { useState } from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import blueUser from '/illustrations/blueuser.png';
import TileApp from "../../../../shared/components/TileApp";
import { BiChevronRight, BiEdit, BiTrash, BiCheck, BiX, BiCopy, BiMoney, BiHelpCircle } from "react-icons/bi";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import { useProfile } from "../hooks/useProfile";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import TileAppMenu, { type MenuOption } from "../../../../shared/components/TileAppMenu";
import { useCurrency } from "../../../../shared/hooks/useCurrency";

const ProfilePage: React.FC = () => {
    const {
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect,
        isAccountOptionsLoading,
        handleAddBank,
        walletAddresses,
        walletComboBoxOptions,
        selectedWalletAddress,
        onWalletSelect,
        handleAddWallet,
    } = useAccountOptions();

    const {
        logOut,
        profileImage,
        fileInputRef,
        handleFileSelect,
        handleAddProfileImage,
        handleRemoveProfileImage,
        fullName,
        isEditingName,
        tempName,
        handleEditName,
        handleNameChange,
        handleConfirmNameChange,
        handleCancelNameEdit,
        isLoadingUserData,
        isUploadingImage,
        walletAddress,
        role,
        kycStatus,
        handleKycStatusInfo,
        kycStatusInfo,
    } = useProfile();

    const { currency, setCurrency, availableCurrencies } = useCurrency();

    const [isCopied, setIsCopied] = useState(false);

    // ✅ Determinar si es cashier
    const isCashier = role?.toUpperCase() === 'CASHIER';

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    const [selectedType, setSelectedType] = useState<string | null>(currency);

    const currencyMenuOptions: MenuOption[] = availableCurrencies.map((curr) => ({
        id: curr,
        label: curr,
        icon: <BiMoney className="w-5 h-5" />,
    }));

    const onCurrencySelect = (selectedId: string) => {
        setSelectedType(selectedId);
        setCurrency(availableCurrencies.find(c => c === selectedId) || 'USD');
    }

    const currentKycInfo = kycStatusInfo[kycStatus as keyof typeof kycStatusInfo] || kycStatusInfo.UNKNOWN;

    if (isAccountOptionsLoading || isLoadingUserData) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando perfil...</span>
            </div>
        );
    }

    // ✅ Vista CASHIER - Solo datos básicos y cerrar sesión
    if (isCashier) {
        return (
            <div className="flex flex-col h-full p-4">
                <AppHeader title="Perfil" />

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Imagen de perfil */}
                <div className="relative w-30 h-30 mx-auto mb-6 mt-4">
                    <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            <img
                                src={profileImage}
                                alt="Profile"
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <img
                                src={blueUser}
                                alt="User Icon"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Nombre */}
                <div className="mb-6 px-4">
                    <h2 className="text-xl font-semibold text-gray-900 text-center">
                        {isLoadingUserData ? 'Cargando...' : fullName}
                    </h2>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mx-2 my-4"></div>

                {/* Cerrar sesión */}
                <div className="flex flex-col p-2 mt-auto mb-4">
                    <TileApp
                        title="Cerrar sesión"
                        titleClassName="text-red-600 font-bold truncate max-w-[70%]"
                        titleSize="lg"
                        onClick={logOut}
                        trailing={
                            <div className="flex items-center gap-1">
                                <BiChevronRight className="w-8 h-8" />
                            </div>
                        }
                    />
                </div>
            </div>
        );
    }

    // ✅ Vista ADMIN y EMPLOYEE - Layout completo
    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader title="Perfil" />

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Imagen de perfil con botón de editar */}
            <div className="relative w-30 h-30 mx-auto mb-6 mt-4">
                <div className="w-30 h-30 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover object-center"
                        />
                    ) : (
                        <img
                            src={blueUser}
                            alt="User Icon"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-blue-500"></div>
                    </div>
                )}

                <button
                    onClick={handleAddProfileImage}
                    disabled={isUploadingImage}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <BiEdit className="w-4 h-4 text-white" />
                </button>

                {profileImage && !isUploadingImage && (
                    <button
                        onClick={handleRemoveProfileImage}
                        disabled={isUploadingImage}
                        className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <BiTrash className="w-3 h-3 text-white" />
                    </button>
                )}
            </div>

            {/* Sección del nombre */}
            <div className="mb-3 px-4">
                {isEditingName ? (
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={tempName}
                            onChange={handleNameChange}
                            className="flex-1 text-xl font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1 text-center"
                            placeholder="Ingresa tu nombre"
                            autoFocus
                            maxLength={50}
                            disabled={isUploadingImage}
                        />
                        <button
                            onClick={handleConfirmNameChange}
                            disabled={isUploadingImage}
                            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <BiCheck className="w-5 h-5 text-white" />
                        </button>
                        <button
                            onClick={handleCancelNameEdit}
                            disabled={isUploadingImage}
                            className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <BiX className="w-5 h-5 text-white" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <h2 className="text-xl font-semibold text-gray-900 text-center">
                            {isLoadingUserData ? 'Cargando...' : fullName}
                        </h2>
                        <button
                            onClick={handleEditName}
                            disabled={isUploadingImage}
                            className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <BiEdit className="w-3 h-3 text-white" />
                        </button>
                    </div>
                )}
            </div>

            {/* KYC Status */}
            <div className="flex justify-center mb-2 px-2 gap-1 items-center">
                <span onClick={handleKycStatusInfo} className={`px-3 py-1 rounded-full text-sm font-medium ${currentKycInfo.bgColor} ${currentKycInfo.textColor} cursor-pointer`}>
                    {currentKycInfo.label}
                </span>
                <button
                    onClick={handleKycStatusInfo}
                    className="
                        p-1.5 rounded-full
                        hover:bg-gray-200 hover:scale-110
                        active:bg-gray-300
                        transition-all duration-200
                        flex items-center justify-center
                    "
                    title="Información del estado KYC"
                >
                    <BiHelpCircle className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="flex flex-col p-2">
                <TileAppMenu
                    title="Moneda"
                    subtitle="Moneda de preferencia"
                    titleSize="lg"
                    menuOptions={currencyMenuOptions}
                    onMenuSelect={onCurrencySelect}
                    selectedMenuId={selectedType}
                />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mx-2 my-4"></div>

            {/* Dirección */}
            <div className="flex flex-col items-center mb-6 px-2">
                <div className="w-full">
                    <TileApp
                        title="Tu dirección"
                        subtitle={formatCryptoAddressCustom(walletAddress, 20, 4)}
                        titleSize="base"
                        subtitleSize="xs"
                        trailing={
                            <button
                                onClick={handleCopyAddress}
                                className="
                                    flex items-center justify-center
                                    w-10 h-10
                                    rounded-full
                                    bg-blue-100
                                    hover:bg-blue-200
                                    transition-colors duration-200
                                    cursor-pointer
                                    flex-shrink-0
                                "
                                title="Copiar dirección"
                            >
                                {isCopied ? (
                                    <BiCheck className="w-5 h-5 text-green-600" />
                                ) : (
                                    <BiCopy className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Wallets */}
            <div className="mb-6 px-2">
                <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                    Direcciones guardadas
                </div>

                {walletAddresses && walletAddresses.length > 0 ? (
                    <ComboBoxApp
                        options={walletComboBoxOptions}
                        selectedId={selectedWalletAddress}
                        onSelect={onWalletSelect}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={handleAddWallet}
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

            {/* Banks */}
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

            {/* Divider */}
            <div className="border-t border-gray-700 mx-2 my-4"></div>

            {/* Logout */}
            <div className="flex flex-col p-2 mt-2">
                <TileApp
                    title="Cerrar sesión"
                    titleClassName="text-red-600 font-bold truncate max-w-[70%]"
                    titleSize="lg"
                    onClick={logOut}
                    trailing={
                        <div className="flex items-center gap-1">
                            <BiChevronRight className="w-8 h-8" />
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default ProfilePage;