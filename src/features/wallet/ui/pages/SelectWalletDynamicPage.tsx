import React, { useEffect } from "react";
import { BiHistory } from "react-icons/bi";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";
import type { TransactionType } from "../hooks/useSetAmountDynamic";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import AppHeader from "../../../../shared/components/AppHeader";
import { useLocation } from "react-router-dom";
import { IoPerson } from "react-icons/io5";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import ComboBoxApp, {
  type ComboBoxOption,
} from "../../../../shared/components/ComboBoxApp";
import TransferSection from "../components/TransferSection";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useSelectWalletDynamic } from "../hooks/useSelectWalletDynamic";

export interface SelectWalletDynamicPageProps {
  title?: string;
  token?: DynamicToken;
  availableCrypto?: number;
  showSwitchCoin?: boolean;
  typeTransaction?: TransactionType;
  onContinue?: (amount: string, token: DynamicToken) => void;
}

const SelectWalletDynamicPage: React.FC<SelectWalletDynamicPageProps> = (
  props
) => {
  const { goToHistory, goToProfile } = useAppBar();
  const location = useLocation();

  // ✅ NUEVO: Hook personalizado con lógica de selección de wallet
  const {
    transferAddress,
    selectedWalletAddress,
    finalAddress,
    handleTransferAddressChange,
    handleWalletSelect,
    handleContinue,
    handleScanQR,
    isValidAddress,
    canContinue,
    title,
  } = useSelectWalletDynamic(props);

  // ✅ Hook de cuentas
  const {
    walletAddresses,
    walletComboBoxOptions,
    onWalletSelect,
    handleAddWallet,
  } = useAccountOptions();

  // ✅ Manejar dirección escaneada desde QR
  useEffect(() => {
    if (location.state?.scannedAddress) {
      handleTransferAddressChange(location.state.scannedAddress);
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.scannedAddress, handleTransferAddressChange]);

  // ✅ Manejar selección de wallet desde ComboBox
  const handleWalletSelectLocal = (walletAddress: ComboBoxOption) => {
    handleWalletSelect(
      walletAddresses.find((w) => w.id === walletAddress.id)?.address || ""
    );
    onWalletSelect(walletAddress);
  };

  return (
    <div className="h-9/10 md:h-12/12 lg:h-12/12 flex flex-col p-4">
      <div className="flex flex-col h-full">
        {/* Header */}
        <AppHeader
          title={title || "Seleccionar Wallet"}
          rightActions={[
            {
              icon: BiHistory,
              onClick: goToHistory,
              className: "text-gray-700",
            },
            {
              icon: IoPerson,
              onClick: goToProfile,
              className: "text-gray-700",
            },
          ]}
        />

        {/* Descripción/Título */}
        {props.typeTransaction == "transfer" ? (
          <div className="px-4 mt-4">
            <DescriptionApp
              title="¿A qué wallet deseas enviar?"
              description="Escribe la dirección a la que deseas enviar o selecciona una de tus wallets guardadas para continuar"
            />
          </div>
        ) : (
          <div className="px-4 mt-4">
            <DescriptionApp
              title="¿A qué wallet deseas comprar?"
              description="Escribe la dirección a la que deseas comprar o selecciona una de tus wallets guardadas para continuar"
            />
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Transfer Input Section */}
          <div className="py-5">
            <TransferSection
              address={transferAddress}
              onChange={handleTransferAddressChange}
              onScanQR={handleScanQR}
            />
          </div>

          {/* Direcciones guardadas */}
          <div className="mb-6 px-2">
            <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
              Direcciones guardadas
            </div>

            {walletAddresses && walletAddresses.length > 0 ? (
              <ComboBoxApp
                options={walletComboBoxOptions}
                selectedId={selectedWalletAddress}
                onSelect={(option) => handleWalletSelectLocal(option)}
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
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-sm font-bold text-[#020F1E] mt-0.75">
                  Agregar wallet
                </span>
              </button>
            )}
          </div>

          {/* ✅ Mostrar validación de dirección */}
          {finalAddress && !isValidAddress(finalAddress) && (
            <div className="px-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                La dirección ingresada no es válida. Por favor, verifica el
                formato.
              </p>
            </div>
          )}

          {/* ✅ Mostrar dirección seleccionada */}
          {finalAddress && isValidAddress(finalAddress) && (
            <div className="px-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-600 mb-1">
                Dirección seleccionada:
              </p>
              <p className="text-sm font-mono text-green-700 break-all">
                {finalAddress}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Button */}
        <div className="flex-shrink-0 px-2 pt-4 border-t border-gray-200">
          <ButtonApp
            text="Continuar"
            paddingVertical="py-3"
            textSize="text-sm"
            isMobile={true}
            onClick={handleContinue}
            disabled={!canContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectWalletDynamicPage;
