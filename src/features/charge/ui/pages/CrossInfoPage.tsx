import { useState } from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import TileApp from "../../../../shared/components/TileApp";
import { BiCheck, BiCopy } from "react-icons/bi";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useCrossInfoPage } from "../hooks/useCrossInfoPage";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { TransactionStatus } from "../../../history/ui/components/TileHistory";

const CrossInfoPage = () => {
  const { crossRampData, isLoadingOrderData, onContinue, error, orderId } =
    useCrossInfoPage();

  const [isCopiedAccount, setIsCopiedAccount] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const status: TransactionStatus = crossRampData?.status || "pending";

  // Configuración de textos según status
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return {
          title: "¡Transferencia realizada!",
          subtitle: "Se ha completado tu transferencia exitosamente",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
          buttonText: "Continuar",
        };
      case "canceled":
        return {
          title: "Transferencia cancelada",
          subtitle: "Tu transacción ha sido cancelada",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
          buttonText: "Volver",
        };
      case "pending":
      default:
        return {
          title: "Completa tu transferencia",
          subtitle: "Transfiere los fondos a la siguiente cuenta bancaria",
          showBankDetails: true,
          showTransferMessage: true,
          showAmounts: true,
          buttonText: "Continuar",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/cross-order/${orderId}`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(crossRampData?.accountIdentifier || "");
    setIsCopiedAccount(true);

    setTimeout(() => {
      setIsCopiedAccount(false);
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
    <div className="bg-white w-full">
      {/* Header */}
      <AppHeader title="Transferencia internacional" showBackButton={false} />
      {isLoadingOrderData ? (
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center min-w-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500 text-center mt-4">
            Cargando orden...
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden justify-center items-center max-w-sm mx-auto">
          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-2">
            {/* Título principal */}
            <div className="text-center mb-6 w-full py-2">
              <h1 className="text-2xl font-bold text-[#020F1E]">
                {statusConfig.title}
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                {statusConfig.subtitle}
              </p>
            </div>

            {/* Información de cuenta bancaria - Reorganizado */}
            <div className="w-full max-w-xs">
              {statusConfig.showBankDetails && (
                <>
                  {/* Número de cuenta - PRIMERO */}
                  <TileApp
                    title="Número de cuenta"
                    subtitle={crossRampData?.accountIdentifier || "—"}
                    subtitleClassName="text-sm font-mono text-[#020F1E] break-all"
                    titleClassName="text-base text-[#666666]"
                    className="mb-3"
                    trailing={
                      <button
                        onClick={handleCopyAccount}
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
                        title="Copiar cuenta"
                      >
                        {isCopiedAccount ? (
                          <BiCheck className="w-5 h-5 text-green-600" />
                        ) : (
                          <BiCopy className="w-5 h-5 text-blue-600" />
                        )}
                      </button>
                    }
                  />

                  {/* Beneficiario - SEGUNDO */}
                  <TileApp
                    title="A nombre de"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.beneficiaryName || "—"}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Banco - TERCERO */}
                  <TileApp
                    title="Banco"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.bankName || "—"}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Concepto - CUARTO */}
                  <TileApp
                    title="Concepto"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.concept || "—"}
                      </span>
                    }
                    className="mb-3"
                  />
                </>
              )}

              {/* Información de montos y país */}
              {statusConfig.showAmounts && (
                <>
                  {/* País destino - QUINTO */}
                  <TileApp
                    title="País destino"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.countryTarget || "—"}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Monto a enviar - SEXTO */}
                  <TileApp
                    title="Monto a enviar"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.amountSource || "—"}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Monto a recibir - SÉPTIMO */}
                  <TileApp
                    title="Monto a recibir"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-base font-semibold text-[#020F1E]">
                        {crossRampData?.amountTarget || "—"}
                      </span>
                    }
                    className="mb-3"
                  />

                  {/* Link de cobro - OCTAVO */}
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

                  {/* ID de orden - NOVENO */}
                  <TileApp
                    title="ID de orden"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                      <span className="text-xs font-mono text-[#666666]">
                        {formatCryptoAddress(orderId || "—", "medium")}
                      </span>
                    }
                  />
                </>
              )}
            </div>
          </div>

          {/* Footer - fijo al final */}
          <div className="flex-shrink-0 space-y-3 border-t border-gray-200 pt-4 mt-4">
            {statusConfig.showTransferMessage && (
              <div className="px-2">
                <p className="text-sm text-[#666666] text-center">
                  Realiza la transferencia y confirma una vez completada
                </p>
              </div>
            )}

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
  );
};

export default CrossInfoPage;
