import React from "react";
import ButtonApp from "../../../../shared/components/ButtonApp";
import InputApp from "../../../../shared/components/InputApp";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import { useSignup } from "../hooks/useSignup";
import crypto from "/illustrations/crypto.png";
import AppHeader from "../../../../shared/components/AppHeader";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";

const SignUpPage: React.FC = () => {
    const {
        fullname,
        fullnameError,
        email,
        phone,
        phoneError,
        countryCode,
        countryCodeError,
        isLoading,
        error,
        handleFullnameChange,
        handleEmailChange,
        handlePhoneChange,
        handleCountryCodeChange,
        handleUpdateUser,
    } = useSignup();

    const {
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect,
        isAccountOptionsLoading,
    } = useAccountOptions();

    if (isAccountOptionsLoading) {
        return (
            <div className="flex flex-1 flex-col h-full items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full p-4">

            <AppHeader
                title="Crear cuenta"
                showBackButton={false}
            />

            {/* Imagen placeholder */}
            <div className="w-30 h-30 mx-auto mb-6 flex items-center justify-center mt-10">
                <img src={crypto} alt="Crypto Icon" className="w-full h-full" />
            </div>

            <DescriptionApp
                title='Termina tu cuenta FlowFi'
                description='Completa los siguientes campos para crear tu cuenta y cobrar facilmente.'
            />

            {/* Input de nombre */}
            <div className="mb-3">
                <InputApp
                    label='Nombre completo'
                    type='text'
                    placeholder='Nombre Apellido'
                    value={fullname}
                    onChange={(e) => handleFullnameChange(e.target.value)}
                    error={fullnameError}
                    disabled={isLoading}
                />
            </div>

            {/* Input de correo */}
            <div className="mb-3">
                <InputApp
                    label='Correo electronico'
                    type='email'
                    placeholder='ejemplo@correo.com'
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    disabled={true}
                />
            </div>

            {/* Input de telefono */}
            <div className="w-full mb-6">
                <label className="block text-sm font-medium text-[#020F1E] mb-2">
                    Teléfono
                </label>
                <div className="flex gap-2">
                    <div className="w-1/4">
                        <InputApp
                            showLabel={false}
                            type='tel'
                            placeholder='+52'
                            value={countryCode}
                            onChange={(e) => handleCountryCodeChange(e.target.value)}
                            error={countryCodeError}
                            className="text-center"
                            disabled={true}
                        />
                    </div>
                    <div className="w-3/4">
                        <InputApp
                            showLabel={false}
                            type='tel'
                            placeholder='96 1359 9611'
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            error={phoneError}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-3 px-2">
                <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                    Agregar cuenta de banco
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
                        onClick={() => console.log('Agregar banco')}
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


            {/* Mensaje de error */}
            {error && (
                <div className="mb-3 flex items-center gap-1">
                    <svg
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                </div>
            )}

            {/* Botón continuar */}
            <div className="mb-6 mt-auto">
                <ButtonApp
                    text="Crear cuenta"
                    paddingVertical="py-2"
                    textSize='text-sm'
                    isMobile={true}
                    onClick={handleUpdateUser}
                    loading={isLoading}
                    loadingText='Creando cuenta...'
                    disabled={isLoading || !fullname || !phone || !countryCode}
                />
            </div>
        </div>
    );
};

export default SignUpPage;