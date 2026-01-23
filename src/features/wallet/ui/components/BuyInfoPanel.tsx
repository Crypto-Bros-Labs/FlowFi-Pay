import React, { useState } from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useBuyInfo } from "../hooks/useBuyInfo";
import TileApp from "../../../../shared/components/TileApp";
import type { Token } from "../../../charge/data/local/tokenLocalService";
import { BiCheck, BiCopy } from "react-icons/bi";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { TransactionStatus } from "../../../history/ui/components/TileHistory";
import historyRepository from "../../../history/data/repositories/historyRepository";

export interface BuyInfoData {
  amountFiat: string;
  amountToken: string;
  tokenSymbol: string;
  networkName: string;
  orderId: string;
  id: string;
  clabe: string;
  beneficiaryName: string;
  status: TransactionStatus;
}

interface BuyInfoPanelProps {
  onClose?: () => void;
  onContinue?: () => void;
  token?: Token;
  buyInfoData?: BuyInfoData;
  orderId?: string;
  clabe?: string;
  beneficiaryName?: string;
}

const BuyInfoPanel: React.FC<BuyInfoPanelProps> = ({
  onClose,
  onContinue,
  token,
  buyInfoData,
  orderId,
  clabe,
  beneficiaryName,
}) => {
  const { amounts } = useBuyInfo();

  const [isCopiedClabe, setIsCopiedClabe] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const amountFiat = buyInfoData?.amountFiat || amounts?.amountFiat;
  const amountToken = buyInfoData?.amountToken || amounts?.amountToken;
  const tokenSymbol = buyInfoData?.tokenSymbol || token?.symbol;
  const networkName = buyInfoData?.networkName || token?.network;
  const orderIdValue = buyInfoData?.orderId || orderId;
  const clabeValue = buyInfoData?.clabe || clabe;
  const beneficiaryNameValue = buyInfoData?.beneficiaryName || beneficiaryName;
  const status = buyInfoData?.status || "pending";
  const transactionId = buyInfoData?.id || "";

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/deposit-order/${orderIdValue}`;

  // Configuración de textos según status
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return {
          title: "¡Pago realizado!",
          subtitle: "Se ha completado tu compra exitosamente",
          buttonText: "Continuar",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
        };
      case "canceled":
        return {
          title: "Pago cancelado",
          subtitle: "Tu transacción ha sido cancelada",
          buttonText: "Volver",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
        };
      case "pending":
      default:
        return {
          title: "Completa tu compra",
          subtitle: "Transfiere los fondos a la siguiente cuenta bancaria",
          buttonText: "Continuar",
          showBankDetails: true,
          showTransferMessage: true,
          showAmounts: true,
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(clabeValue || "");
    setIsCopiedClabe(true);

    setTimeout(() => {
      setIsCopiedClabe(false);
    }, 2000);
  };

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    setIsCopiedLink(true);

    setTimeout(() => {
      setIsCopiedLink(false);
    }, 2000);
  };

  // ✅ Función para cancelar transacción
  const handleCancelTransaction = async () => {
    setIsCancelLoading(true);
    try {
      const result = await historyRepository.cancelTransaction(transactionId);
      if (result.success) {
        console.log("Transacción cancelada con éxito");
        onContinue?.();
      } else {
        console.error("Error al cancelar transacción:", result.error);
      }
    } catch (err) {
      console.error("Error cancelando transacción:", err);
    } finally {
      setIsCancelLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[1.25rem] w-full max-h-[80vh] md:max-h-[90vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header */}
      <HeaderModal isModal={true} onBack={onClose} onClose={onClose} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Título principal - FIJO */}
        <div className="text-center border-b border-gray-100 flex-shrink-0">
          <h1 className="text-xl font-bold text-[#020F1E]">
            {statusConfig.title}
          </h1>
          <p className="text-sm text-gray-500 mt-2">{statusConfig.subtitle}</p>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
          {/* Información de cuenta bancaria */}
          <div className="w-full max-w-xs mt-10 md:mt-1">
            {statusConfig.showBankDetails && (
              <>
                {/* CLABE */}
                <TileApp
                  title="CLABE"
                  subtitle={clabeValue}
                  subtitleClassName="text-sm font-mono text-[#020F1E] break-all"
                  titleClassName="text-base text-[#666666]"
                  className="mb-3"
                  trailing={
                    <button
                      onClick={handleCopyClabe}
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
                      title="Copiar CLABE"
                    >
                      {isCopiedClabe ? (
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

                {/* Beneficiario */}
                <TileApp
                  title="A nombre de"
                  titleClassName="text-base text-[#666666]"
                  trailing={
                    <span className="text-base font-semibold text-[#020F1E]">
                      {beneficiaryNameValue || "—"}
                    </span>
                  }
                  className="mb-3"
                />
              </>
            )}

            {/* Información de montos y red - Siempre visible */}
            {statusConfig.showAmounts && (
              <>
                {/* Monto a enviar (Fiat) */}
                <TileApp
                  title="Monto a enviar"
                  titleClassName="text-base text-[#666666]"
                  trailing={
                    <span className="text-base font-semibold text-[#020F1E]">
                      {amountFiat} MXN
                    </span>
                  }
                  className="mb-3"
                />

                {/* Recibirás (Crypto) */}
                <TileApp
                  title={`Recibirás (${tokenSymbol})`}
                  titleClassName="text-base text-[#666666]"
                  trailing={
                    <span className="text-base font-semibold text-[#020F1E]">
                      {amountToken}
                    </span>
                  }
                  className="mb-3"
                />

                {/* Red */}
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

                {/* ID de orden */}
                <TileApp
                  title="ID de orden"
                  titleClassName="text-base text-[#666666]"
                  trailing={
                    <span className="text-xs font-mono text-[#666666]">
                      {formatCryptoAddress(orderIdValue || "—", "medium")}
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
          <div className="mb-2">
            <ButtonApp
              text={statusConfig.buttonText}
              textSize="text-sm"
              paddingVertical="py-2"
              isMobile={true}
              onClick={onContinue}
            />
          </div>

          {/* ✅ Botón cancelar - Solo para pending */}
          {status === "pending" && (
            <ButtonApp
              text="Cancelar"
              textSize="text-sm"
              paddingVertical="py-2"
              backgroundColor="bg-red-500"
              isMobile={true}
              loading={isCancelLoading}
              onClick={handleCancelTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyInfoPanel;
