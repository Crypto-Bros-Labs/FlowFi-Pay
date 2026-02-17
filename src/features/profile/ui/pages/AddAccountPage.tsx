import React from "react";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddAccount } from "../hooks/useAddAccount";
import AppHeader from "../../../../shared/components/AppHeader";

const AddAccountPage: React.FC = () => {
  const {
    accountCountry,
    setAccountCountry,
    clabe,
    formattedClabe,
    handleClabeChange,
    bankOptions,
    selectedBankComponent,
    handleBankSelect,
    usaAccount,
    handleUsaAccountChange,
    errors,
    handleAddAccount,
    isLoading,
    error,
    isFormValid,
  } = useAddAccount();

  return (
    <div className="flex flex-col h-full p-4">
      <AppHeader title="Agregar Cuenta" />

      {/* Imagen placeholder */}
      <div className="w-20 h-20 bg-blue-50 rounded-full mx-auto mb-6 mt-6 flex items-center justify-center border-2 border-blue-100">
        <svg
          className="w-10 h-10 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>

      {/* Selector de país */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#020F1E] mb-2">
          País
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAccountCountry("MX")}
            className={`
                            flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                            transition-all duration-200
                            ${
                              accountCountry === "MX"
                                ? "bg-blue-500 text-white border-2 border-blue-500"
                                : "bg-white text-[#020F1E] border-2 border-[#666666]"
                            }
                            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                        `}
          >
            México
          </button>
          <button
            type="button"
            onClick={() => setAccountCountry("US")}
            className={`
                            flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                            transition-all duration-200
                            ${
                              accountCountry === "US"
                                ? "bg-blue-500 text-white border-2 border-blue-500"
                                : "bg-white text-[#020F1E] border-2 border-[#666666]"
                            }
                            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                        `}
          >
            USA
          </button>
        </div>
      </div>

      {/* FORMULARIO MÉXICO */}
      {accountCountry === "MX" && (
        <>
          <DescriptionApp
            title="Agrega tu CLABE"
            description="Agrega tu cuenta de banco solo con tu CLABE"
          />

          <div className="mb-6">
            <InputApp
              label="CLABE"
              type="text"
              placeholder="1234 5678 9012 3456 78"
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
              placeholder={
                <span className="text-gray-500">Completa tu CLABE</span>
              }
            />
          </div>
        </>
      )}

      {/* FORMULARIO USA */}
      {accountCountry === "US" && (
        <>
          <DescriptionApp
            title="Agrega tu cuenta bancaria"
            description="Completa los datos de tu cuenta bancaria de USA"
          />

          {/* Selector tipo de cuenta */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#020F1E] mb-2">
              Tipo de cuenta
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  handleUsaAccountChange("accountType", "INDIVIDUAL")
                }
                className={`
                                    flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                                    transition-all duration-200
                                    ${
                                      usaAccount.accountType === "INDIVIDUAL"
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
                onClick={() =>
                  handleUsaAccountChange("accountType", "BUSINESS")
                }
                className={`
                                    flex-1 py-2.5 px-4 rounded-[10px] font-medium text-sm
                                    transition-all duration-200
                                    ${
                                      usaAccount.accountType === "BUSINESS"
                                        ? "bg-blue-500 text-white border-2 border-blue-500"
                                        : "bg-white text-[#020F1E] border-2 border-[#666666]"
                                    }
                                    hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                                `}
              >
                Negocio
              </button>
            </div>
          </div>

          {/* Datos de la cuenta */}
          <div className="mb-3">
            <InputApp
              label="Número de cuenta"
              type="text"
              placeholder="123456789"
              value={usaAccount.accountNumber}
              onChange={(e) =>
                handleUsaAccountChange("accountNumber", e.target.value)
              }
              error={errors.accountNumber}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Número de ruta (Routing Number)"
              type="text"
              placeholder="012345678"
              value={usaAccount.routingNumber}
              onChange={(e) =>
                handleUsaAccountChange("routingNumber", e.target.value)
              }
              error={errors.routingNumber}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Banco"
              type="text"
              placeholder="Bank of America"
              value={usaAccount.bankName}
              onChange={(e) =>
                handleUsaAccountChange("bankName", e.target.value)
              }
              error={errors.bankName}
              disabled={isLoading}
            />
          </div>

          {/* Datos del titular */}
          {usaAccount.accountType === "BUSINESS" && (
            <div className="mb-3">
              <InputApp
                label="Nombre del negocio"
                type="text"
                placeholder="Nombre legal del negocio"
                value={usaAccount.businessName}
                onChange={(e) =>
                  handleUsaAccountChange("businessName", e.target.value)
                }
                error={errors.businessName}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="mb-3">
            <InputApp
              label="Nombres"
              type="text"
              placeholder="Juan"
              value={usaAccount.firstName}
              onChange={(e) =>
                handleUsaAccountChange("firstName", e.target.value)
              }
              error={errors.firstName}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Apellidos"
              type="text"
              placeholder="Pérez"
              value={usaAccount.lastName}
              onChange={(e) =>
                handleUsaAccountChange("lastName", e.target.value)
              }
              error={errors.lastName}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Número de identificación (Passport, SSN, etc.)"
              type="text"
              placeholder="123-45-6789"
              value={usaAccount.documentIdentifier}
              onChange={(e) =>
                handleUsaAccountChange("documentIdentifier", e.target.value)
              }
              error={errors.documentIdentifier}
              disabled={isLoading}
            />
          </div>

          {/* Dirección */}
          <div className="mb-3">
            <InputApp
              label="Dirección"
              type="text"
              placeholder="123 Maple Avenue"
              value={usaAccount.streetLine1}
              onChange={(e) =>
                handleUsaAccountChange("streetLine1", e.target.value)
              }
              error={errors.streetLine1}
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Dirección (línea 2)"
              type="text"
              placeholder="Apt 4B"
              value={usaAccount.streetLine2}
              onChange={(e) =>
                handleUsaAccountChange("streetLine2", e.target.value)
              }
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <InputApp
              label="Ciudad"
              type="text"
              placeholder="Miami"
              value={usaAccount.city}
              onChange={(e) => handleUsaAccountChange("city", e.target.value)}
              error={errors.city}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 mb-3">
            <div className="w-1/3">
              <InputApp
                label="Estado"
                type="text"
                placeholder="FL"
                value={usaAccount.state}
                onChange={(e) =>
                  handleUsaAccountChange("state", e.target.value.toUpperCase())
                }
                error={errors.state}
                disabled={isLoading}
              />
            </div>
            <div className="w-2/3">
              <InputApp
                label="Código postal"
                type="text"
                placeholder="33101"
                value={usaAccount.postalCode}
                onChange={(e) =>
                  handleUsaAccountChange("postalCode", e.target.value)
                }
                error={errors.postalCode}
                disabled={isLoading}
              />
            </div>
          </div>
        </>
      )}

      {/* Mensaje de error general */}
      {error && (
        <div className="mb-3 flex items-center gap-2">
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

      {/* Botón */}
      <div className="mt-auto mb-4">
        <ButtonApp
          text="Agregar cuenta"
          paddingVertical="py-2"
          textSize="text-sm"
          isMobile={true}
          onClick={handleAddAccount}
          loading={isLoading}
          loadingText="Agregando..."
          disabled={!isFormValid || isLoading}
        />
      </div>
    </div>
  );
};

export default AddAccountPage;
