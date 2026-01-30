import { useState } from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import QRCode from "../../../../shared/components/QRCode";
import TileApp from "../../../../shared/components/TileApp";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import { BiCheck, BiCopy } from "react-icons/bi";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useWithdrawalInfoPage } from "../hooks/useWithdrawalInfo";
import type { TransactionStatus } from "../../../history/ui/components/TileHistory";

const WithdrawalInfoPage = () => {
  const {
    qrData,
    amounts,
    isLoadingOrderData,
    walletAddress,
    selectedToken,
    networkName,
    onContinue,
    error,
    orderId,
    walletData,
  } = useWithdrawalInfoPage();

  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/withdrawal-order/${orderId}`;
  const status: TransactionStatus = walletData?.status || "pending";

  // Configuración de textos según status
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return {
          title: "¡Retiro completado!",
          subtitle: "Tu retiro ha sido procesado exitosamente",
          showQRCode: false,
          showWalletDetails: true,
          showLegend: false,
          legendText: "",
          buttonText: "Continuar",
        };
      case "canceled":
        return {
          title: "Retiro cancelado",
          subtitle: "Tu transacción ha sido cancelada",
          showQRCode: false,
          showWalletDetails: true,
          showLegend: false,
          legendText: "",
          buttonText: "Volver",
        };
      case "pending":
      default:
        return {
          title: "¡Realiza el pago!",
          subtitle: "Envía los fondos a la dirección indicada",
          showQRCode: true,
          showWalletDetails: true,
          showLegend: true,
          legendText:
            "Usa este código QR o la dirección para completar el pago desde tu wallet.",
          buttonText: "Continuar",
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

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopiedLink(true);

    setTimeout(() => {
      setIsCopiedLink(false);
    }, 2000);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full p-4">
        <AppHeader title="Error" showBackButton={false} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <AppHeader title="Orden de cobro" showBackButton={false} />
        {isLoadingOrderData ? (
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center min-w-[350px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500 text-center mt-4">
              Cargando orden...
            </span>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden justify-center items-center">
            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-2">
              {/* Título principal */}
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-[#020F1E]">
                  {statusConfig.title}
                </h1>
                {statusConfig.subtitle && (
                  <p className="text-sm text-gray-500 mt-2">
                    {statusConfig.subtitle}
                  </p>
                )}
              </div>

              {/* QR Code - PRIMERO */}
              {statusConfig.showQRCode && (
                <div className="mb-6 flex flex-col items-center">
                  <QRCode data={qrData} size={150} className="mb-2" />
                  <p className="text-xs text-gray-500 text-center">
                    Escanea para enviar crypto a esta dirección
                  </p>
                </div>
              )}

              {/* Información de montos y red - Reorganizado */}
              {statusConfig.showWalletDetails && (
                <div className="w-full max-w-xs">
                  {/* Red - SEGUNDO */}
                  <TileApp
                    title="Red"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {networkName}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Dirección - TERCERO */}
                  <TileApp
                    title={formatCryptoAddressCustom(walletAddress, 15, 4)}
                    titleClassName="text-base text-[#666666]"
                    className="mb-3"
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

                  {/* Monto Token - CUARTO */}
                  <TileApp
                    title={`Monto (${selectedToken})`}
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {amounts?.amountToken}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Monto Fiat - QUINTO */}
                  <TileApp
                    title="Monto (Fiat)"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {amounts?.amountFiat} MXN
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Link de cobro - SEXTO */}
                  <TileApp
                    title="Link de cobro"
                    titleClassName="text-base text-[#666666]"
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
                </div>
              )}
            </div>

            {/* Footer - sin scroll (leyenda y botones) */}
            <div className="flex-shrink-0 space-y-3 border-t border-gray-200 pt-4 mt-4 max-w-sm">
              {/* Leyenda - Condicional según status */}
              {statusConfig.showLegend && (
                <div className="px-4">
                  <p className="text-sm text-[#666666] text-center">
                    {statusConfig.legendText}
                  </p>
                </div>
              )}

              {/* Botón continuar */}
              <ButtonApp
                text={statusConfig.buttonText}
                textSize="text-sm"
                paddingVertical="py-2"
                isMobile={true}
                onClick={onContinue}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalInfoPage;
