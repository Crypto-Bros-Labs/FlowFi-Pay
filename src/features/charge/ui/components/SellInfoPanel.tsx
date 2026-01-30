import React, { useState } from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import QRCode from "../../../../shared/components/QRCode";
import { useSellInfo } from "../hooks/useSellInfo";
import TileApp from "../../../../shared/components/TileApp";
import type { Token } from "../../data/local/tokenLocalService";
import { BiCheck, BiCopy } from "react-icons/bi";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

export interface SellInfoData {
  amountFiat: string;
  amountToken: string;
  tokenSymbol: string;
  networkName: string;
  orderId: string;
  name: string;
}

interface SellInfoPanelProps {
  onClose?: () => void;
  onContinue?: () => void;
  token?: Token;
  sellInfoData?: SellInfoData;
  orderId?: string;
}

const SellInfoPanel: React.FC<SellInfoPanelProps> = ({
  onClose,
  onContinue,
  token,
  sellInfoData,
  orderId,
}) => {
  const { qrData, amounts } = useSellInfo();

  const { isLoadingUserData, walletAddress, fullName } = useProfile();

  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const amountFiat = sellInfoData?.amountFiat || amounts?.amountFiat;
  const amountToken = sellInfoData?.amountToken || amounts?.amountToken;
  const tokenSymbol = sellInfoData?.tokenSymbol || token?.symbol;
  const networkName = sellInfoData?.networkName || token?.network;
  const orderIdValue = sellInfoData?.orderId || orderId;
  const name = sellInfoData?.name || "";

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/recovery-order/${orderIdValue}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopiedLink(true);

    setTimeout(() => {
      setIsCopiedLink(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[1.25rem] w-full max-h-[80vh] md:max-h-[90vh] max-w-md p-3 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header */}
      <HeaderModal isModal={true} onBack={onClose} onClose={onClose} />

      {isLoadingUserData ? (
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center min-w-[340px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500 text-center mt-4">
            Cargando orden...
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Título */}
          <div className="text-center flex-shrink-0 pb-2 border-b border-gray-100">
            <h1 className="text-lg font-bold text-[#020F1E]">
              ¡Realiza el pago!
            </h1>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-3">
            {/* QR Code - PRIMERO */}
            <div className="flex flex-col items-center w-full mb-3">
              <QRCode data={qrData} size={100} className="mb-1" />
              <p className="text-xs text-gray-500 text-center">
                Escanea para enviar crypto
              </p>
            </div>

            {/* Información organizada */}
            <div className="w-full max-w-xs space-y-1">
              {/* Red */}
              <TileApp
                title="Red"
                titleClassName="text-sm text-[#666666]"
                trailing={
                  <span className="text-sm font-semibold text-[#020F1E]">
                    {networkName}
                  </span>
                }
              />

              {/* Dirección */}
              <TileApp
                title={formatCryptoAddressCustom(walletAddress, 15, 4)}
                titleClassName="text-xs text-[#666666]"
                className="truncate"
                trailing={
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer flex-shrink-0"
                    title="Copiar dirección"
                  >
                    {isCopied ? (
                      <BiCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <BiCopy className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                }
              />

              {/* Monto Token */}
              <TileApp
                title={`Monto (${tokenSymbol})`}
                titleClassName="text-sm text-[#666666]"
                trailing={
                  <span className="text-sm font-semibold text-[#020F1E]">
                    {amountToken}
                  </span>
                }
              />

              {/* Monto Fiat */}
              <TileApp
                title="Monto (Fiat)"
                titleClassName="text-sm text-[#666666]"
                trailing={
                  <span className="text-sm font-semibold text-[#020F1E]">
                    {amountFiat} MXN
                  </span>
                }
              />

              {/* Link de cobro */}
              <TileApp
                title="Link de cobro"
                titleClassName="text-sm text-[#666666]"
                trailing={
                  <button
                    onClick={handleCopyPaymentLink}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer flex-shrink-0"
                    title="Copiar link"
                  >
                    {isCopiedLink ? (
                      <BiCheck className="w-4 h-4 text-green-600" />
                    ) : (
                      <BiCopy className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                }
              />

              {/* Cajero (condicional) */}
              {fullName != name && name && (
                <TileApp
                  title="Cajero"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {name}
                    </span>
                  }
                />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 space-y-2 border-t border-gray-200 pt-2 mt-2">
            <p className="text-xs text-[#666666] text-center px-2">
              Muestra este QR a tu cliente para completar el cobro
            </p>
            <ButtonApp
              text="Continuar"
              textSize="text-sm"
              paddingVertical="py-2"
              isMobile={true}
              onClick={onContinue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellInfoPanel;
