import React, { useState } from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import QRCode from "../../../../shared/components/QRCode";
import TileApp from "../../../../shared/components/TileApp";
import { useExternalSellInfo } from "../hooks/useExternalSellInfo";
import type { SellData } from "../../../charge/data/local/sellLocalService";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import { BiCheck, BiCopy } from "react-icons/bi";
import type { WithdrawalInfoData } from "../../../history/ui/hooks/useHistory";

interface SellInfoPanelProps {
  onClose?: () => void;
  onContinue?: () => void;
  token?: DynamicToken;
  sellData?: SellData;
  withdrawalInfo?: WithdrawalInfoData;
}

const ExternalSellInfoPanel: React.FC<SellInfoPanelProps> = ({
  onClose,
  onContinue,
  token,
  sellData,
  withdrawalInfo,
}) => {
  const { qrData, amounts, cancelTransaction, isCancelLoading } =
    useExternalSellInfo({ sellData });
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  // ✅ Variables dinámicas que priorizan sellData pero usan withdrawalInfo como fallback
  const walletAddress =
    sellData?.destinationWalletAddress || withdrawalInfo?.walletAddress || "";
  const orderId = sellData?.orderUuid || withdrawalInfo?.orderId || "";
  const amountFiat = amounts?.amountFiat || withdrawalInfo?.amountFiat || "0";
  const amountToken =
    amounts?.amountToken || withdrawalInfo?.amountToken || "0";
  const tokenSymbol = token?.symbol || withdrawalInfo?.tokenSymbol || "";
  const networkName = token?.network || withdrawalInfo?.networkName || "";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);

    // ✅ Resetear el estado después de 2 segundos
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/withdrawal-order/${orderId}`;

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopiedLink(true);

    setTimeout(() => {
      setIsCopiedLink(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[1.25rem] w-full h-[80vh] md:h-[90vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header - sin scroll */}
      <HeaderModal isModal={true} onBack={onClose} onClose={onClose} />

      {/* Título principal - FIJO */}
      <div className="text-center border-b border-gray-100 flex-shrink-0">
        <h1 className="text-xl font-bold text-[#020F1E]">¡Realiza el pago!</h1>
      </div>

      {/* Contenido scrollable - Solo QR e info */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4">
        {/* QR Code */}
        <div className="flex flex-col items-center mt-25 md:mt-1">
          <QRCode data={qrData} size={150} className="mb-2" />
          <p className="text-xs text-gray-500 text-center">
            Escanea para enviar crypto a esta dirección
          </p>
        </div>

        {/* Información de montos y red */}
        <div className="w-full max-w-xs">
          <TileApp
            title={formatCryptoAddressCustom(walletAddress, 15, 4)}
            titleClassName="text-base text-[#666666]"
            className="mb-1"
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
          <TileApp
            title="Link de cobro"
            titleClassName="text-base text-[#666666]"
            className="mb-3"
            trailing={
              <button
                onClick={handleCopyPaymentLink}
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
                title="Copiar link de cobro"
              >
                {isCopiedLink ? (
                  <BiCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <BiCopy className="w-5 h-5 text-blue-600" />
                )}
              </button>
            }
          />
          <TileApp
            title="Monto"
            titleClassName="text-base text-[#666666]"
            trailing={
              <>
                <span className="text-base font-semibold text-[#020F1E]">
                  {amountFiat} MXN
                </span>
              </>
            }
            className="mb-3"
          />

          <TileApp
            title={`Monto (${tokenSymbol})`}
            titleClassName="text-base text-[#666666]"
            trailing={
              <>
                <span className="text-base font-semibold text-[#020F1E]">
                  {amountToken}
                </span>
              </>
            }
            className="mb-3"
          />

          <TileApp
            title="Red"
            titleClassName="text-base text-[#666666]"
            trailing={
              <>
                <span className="text-base font-semibold text-[#020F1E]">
                  {networkName}
                </span>
              </>
            }
          />
        </div>
      </div>

      {/* Footer - sin scroll (leyenda y botones) */}
      <div className="flex-shrink-0 space-y-3">
        {/* Leyenda */}
        <div className="px-4">
          <p className="text-sm text-[#666666] text-center">
            Muestra este QR a tu cliente para completar el cobro
          </p>
        </div>

        <div className="mb-2">
          {/* Botón continuar */}
          <ButtonApp
            text="Continuar"
            textSize="text-sm"
            paddingVertical="py-2"
            isMobile={true}
            onClick={onContinue}
          />
        </div>

        {/* Botón cancelar */}
        <ButtonApp
          text="Cancelar"
          textSize="text-sm"
          paddingVertical="py-2"
          backgroundColor="bg-red-500"
          isMobile={true}
          loading={isCancelLoading}
          onClick={async () => {
            const transactionId =
              sellData?.id || withdrawalInfo?.transactionId || "";
            const success = await cancelTransaction(transactionId);
            if (success) {
              onContinue?.();
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExternalSellInfoPanel;
