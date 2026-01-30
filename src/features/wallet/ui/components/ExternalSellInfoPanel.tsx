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
import type { TransactionStatus } from "../../../history/ui/components/TileHistory";

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

  const walletAddress =
    sellData?.destinationWalletAddress || withdrawalInfo?.walletAddress || "";
  const orderId = sellData?.orderUuid || withdrawalInfo?.orderId || "";
  const amountFiat = amounts?.amountFiat || withdrawalInfo?.amountFiat || "0";
  const amountToken =
    amounts?.amountToken || withdrawalInfo?.amountToken || "0";
  const tokenSymbol = token?.symbol || withdrawalInfo?.tokenSymbol || "";
  const networkName = token?.network || withdrawalInfo?.networkName || "";
  const status: TransactionStatus =
    sellData?.status || withdrawalInfo?.status || "pending";

  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return {
          title: "¡Retiro completado!",
          subtitle: "Tu retiro ha sido procesado exitosamente",
          buttonText: "Continuar",
          showQRCode: false,
          showWalletDetails: true,
          showCancelButton: false,
          showLegend: false,
          legendText: "",
        };
      case "canceled":
        return {
          title: "Retiro cancelado",
          subtitle: "Tu transacción ha sido cancelada",
          buttonText: "Volver",
          showQRCode: false,
          showWalletDetails: true,
          showCancelButton: false,
          showLegend: false,
          legendText: "",
        };
      case "pending":
      default:
        return {
          title: "¡Realiza el pago!",
          subtitle: "Envía los fondos a la dirección indicada",
          buttonText: "Continuar",
          showQRCode: true,
          showWalletDetails: true,
          showCancelButton: true,
          showLegend: true,
          legendText: "Muestra este QR a tu cliente para completar el cobro",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);

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
    <div className="bg-white rounded-[1.25rem] w-full max-h-[80vh] md:max-h-[90vh] max-w-md p-3 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header */}
      <HeaderModal isModal={true} onBack={onClose} onClose={onClose} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Título principal - FIJO */}
        <div className="text-center border-b border-gray-100 flex-shrink-0 pb-2">
          <h1 className="text-lg font-bold text-[#020F1E]">
            {statusConfig.title}
          </h1>
          <p className="text-xs text-gray-500 mt-1">{statusConfig.subtitle}</p>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-3">
          {/* QR Code - PRIMERO */}
          {statusConfig.showQRCode && (
            <div className="flex flex-col items-center w-full mb-3">
              <QRCode data={qrData} size={100} className="mb-1" />
              <p className="text-xs text-gray-500 text-center">
                Escanea para enviar crypto
              </p>
            </div>
          )}

          {/* Información de montos y red */}
          {statusConfig.showWalletDetails && (
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 space-y-2 border-t border-gray-200 pt-2 mt-2">
          {statusConfig.showLegend && (
            <p className="text-xs text-[#666666] text-center px-2">
              {statusConfig.legendText}
            </p>
          )}
          {/* Botón continuar */}
          <div className="mb-2">
            <ButtonApp
              text={statusConfig.buttonText}
              textSize="text-sm"
              paddingVertical="py-2"
              isMobile={true}
              onClick={onContinue}
            />
          </div>

          {/* Botón cancelar */}
          {statusConfig.showCancelButton && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ExternalSellInfoPanel;
