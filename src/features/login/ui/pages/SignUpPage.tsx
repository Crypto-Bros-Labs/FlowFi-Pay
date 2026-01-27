import React from "react";
import ButtonApp from "../../../../shared/components/ButtonApp";
import InputApp from "../../../../shared/components/InputApp";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import { useSignup } from "../hooks/useSignup";
import crypto from "/illustrations/crypto.png";
import AppHeader from "../../../../shared/components/AppHeader";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

const SignUpPage: React.FC = () => {
  const {
    accountType,
    fullname,
    fullnameError,
    email,
    phone,
    phoneError,
    countryCode,
    countryCodeError,
    rfc,
    rfcError,
    razonSocial,
    razonSocialError,
    nombreComercial,
    nombreComercialError,
    isLoading,
    error,
    handleAccountTypeChange,
    handleFullnameChange,
    handleEmailChange,
    handlePhoneChange,
    handleCountryCodeChange,
    handleRfcChange,
    handleRazonSocialChange,
    handleNombreComercialChange,
    handleUpdateUser,
  } = useSignup();

  const { isLoadingUserData } = useProfile();

  if (isLoadingUserData || isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-500">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-4">
      <AppHeader title="Crear cuenta" showBackButton={false} />

      {/* Imagen placeholder */}
      <div className="w-30 h-30 mx-auto mb-6 flex items-center justify-center mt-10">
        <img src={crypto} alt="Crypto Icon" className="w-full h-full" />
      </div>

      <DescriptionApp
        title="Termina tu cuenta FlowFi"
        description="Completa los siguientes campos para crear tu cuenta y cobrar facilmente."
      />

      {/* Select de tipo de cuenta */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#020F1E] mb-2">
          Tipo de cuenta
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleAccountTypeChange("individual")}
            className={`
                            flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                            transition-all duration-200
                            ${
                              accountType === "individual"
                                ? "bg-blue-500 text-white border-2 border-blue-500"
                                : "bg-white text-[#020F1E] border-2 border-[#666666]"
                            }
                            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                        `}
          >
            Individuo
          </button>
          <button
            type="button"
            onClick={() => handleAccountTypeChange("empresa")}
            className={`
                            flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                            transition-all duration-200
                            ${
                              accountType === "empresa"
                                ? "bg-blue-500 text-white border-2 border-blue-500"
                                : "bg-white text-[#020F1E] border-2 border-[#666666]"
                            }
                            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                        `}
          >
            Empresa
          </button>
        </div>
      </div>

      {/* Campos para Individuo */}
      {accountType === "individual" && (
        <>
          {/* Input de nombre */}
          <div className="mb-3">
            <InputApp
              label="Nombre completo"
              type="text"
              placeholder="Nombre Apellido"
              value={fullname}
              onChange={(e) => handleFullnameChange(e.target.value)}
              error={fullnameError}
              disabled={isLoading}
            />
          </div>

          {/* Input de RFC */}
          <div className="mb-3">
            <InputApp
              label="RFC"
              type="text"
              placeholder="XXXXXXXXXXXXXXX"
              value={rfc}
              onChange={(e) => handleRfcChange(e.target.value)}
              error={rfcError}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {/* Campos para Empresa */}
      {accountType === "empresa" && (
        <>
          {/* Input de Razón Social */}
          <div className="mb-3">
            <InputApp
              label="Razón social"
              type="text"
              placeholder="Nombre legal de la empresa"
              value={razonSocial}
              onChange={(e) => handleRazonSocialChange(e.target.value)}
              error={razonSocialError}
              disabled={isLoading}
            />
          </div>

          {/* Input de Nombre Comercial */}
          <div className="mb-3">
            <InputApp
              label="Nombre comercial"
              type="text"
              placeholder="Nombre con el que se conoce"
              value={nombreComercial}
              onChange={(e) => handleNombreComercialChange(e.target.value)}
              error={nombreComercialError}
              disabled={isLoading}
            />
          </div>

          {/* Input de Nombre Completo del Representante */}
          <div className="mb-3">
            <InputApp
              label="Nombre completo del representante"
              type="text"
              placeholder="Nombre Apellido"
              value={fullname}
              onChange={(e) => handleFullnameChange(e.target.value)}
              error={fullnameError}
              disabled={isLoading}
            />
          </div>

          {/* Input de RFC */}
          <div className="mb-3">
            <InputApp
              label="RFC"
              type="text"
              placeholder="XXXXXXXXXXXXXXX"
              value={rfc}
              onChange={(e) => handleRfcChange(e.target.value)}
              error={rfcError}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {/* Input de correo */}
      <div className="mb-3">
        <InputApp
          label="Correo electronico"
          type="email"
          placeholder="ejemplo@correo.com"
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
              type="tel"
              placeholder="+52"
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
              type="tel"
              placeholder="52 1234 5678"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              error={phoneError}
              disabled={isLoading}
            />
          </div>
        </div>
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
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Botón continuar */}
      <div className="mb-6 mt-auto">
        <ButtonApp
          text="Crear cuenta"
          paddingVertical="py-2"
          textSize="text-sm"
          isMobile={true}
          onClick={handleUpdateUser}
          loading={isLoading}
          loadingText="Creando cuenta..."
          disabled={
            isLoading ||
            !phone ||
            !countryCode ||
            !rfc ||
            (accountType === "individual"
              ? !fullname
              : !razonSocial || !nombreComercial)
          }
        />
      </div>
    </div>
  );
};

export default SignUpPage;
