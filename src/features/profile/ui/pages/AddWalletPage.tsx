import React, { useEffect } from "react";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddWallet } from "../hooks/useAddWallet";
import AppHeader from "../../../../shared/components/AppHeader";
import { BiWallet } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

const AddWalletPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    fullName,
    handleFullNameChange,
    walletAlias,
    handleWalletAliasChange,
    address,
    setAddress,
    handleAddressChange,
    networkOptions,
    selectedNetworkComponent,
    handleNetworkSelect,
    handleAddWallet,
    isLoading,
    errors,
    isFormValid,
  } = useAddWallet();

  useEffect(() => {
    if (location.state?.scannedAddress && location.state) {
      setAddress(location.state.scannedAddress);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.scannedAddress, setAddress, location.state]);

  const handleScanQR = () => {
    navigate("/wallet/qr-scanner", {
      state: {
        returnPath: location.pathname,
      },
    });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <AppHeader title="Agregar Wallet" showBackButton={true} />

      {/* Imagen placeholder */}
      <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center mt-4">
        <BiWallet className="w-10 h-10 text-blue-600" />
      </div>

      <DescriptionApp
        title="Agrega tu wallet"
        description="Completa los datos para agregar una nueva wallet"
      />

      {/* ✅ Nombre completo del beneficiario */}
      <div className="mb-6">
        <InputApp
          label="Nombre completo"
          type="text"
          placeholder="Juan García López"
          value={fullName}
          onChange={(e) => handleFullNameChange(e.target.value)}
          error={errors.fullName}
          disabled={isLoading}
        />
      </div>

      {/* ✅ Alias de la wallet */}
      <div className="mb-6">
        <InputApp
          label="Alias (nombre corto para recordar)"
          type="text"
          placeholder="Mi Wallet Principal"
          value={walletAlias}
          onChange={(e) => handleWalletAliasChange(e.target.value)}
          error={errors.walletAlias}
          disabled={isLoading}
        />
      </div>

      {/* ✅ Dirección pública */}
      <div className="mb-6">
        <InputApp
          label="Dirección pública"
          type="text"
          placeholder="0x9Fc5b510185E7a218A2e5BD..."
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          onScanQR={handleScanQR}
          error={errors.address} // ✅ Error específico
          disabled={isLoading}
        />
      </div>

      {/* ✅ Red */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[#020F1E] mb-2">
          Red
        </label>
        <ComboBoxApp
          options={networkOptions}
          selectedComponent={selectedNetworkComponent}
          onSelect={handleNetworkSelect}
          placeholder={
            <span className="text-gray-500">Selecciona una red</span>
          }
          disabled={isLoading}
        />
        {/* ✅ Mostrar error de red si existe */}
        {errors.network && (
          <div className="mt-1 flex items-center gap-1">
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
            <p className="text-sm text-red-500">{errors.network}</p>
          </div>
        )}
      </div>

      {/* Botón agregar */}
      <div className="mt-auto mb-4">
        <ButtonApp
          text="Agregar wallet"
          paddingVertical="py-3"
          textSize="text-sm"
          isMobile={true}
          onClick={handleAddWallet}
          loading={isLoading}
          loadingText="Agregando..."
          disabled={!isFormValid || isLoading}
        />
      </div>
    </div>
  );
};

export default AddWalletPage;
