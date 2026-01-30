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

  const handleCancelTransaction = async () => {
    setIsCancelLoading(true);
    try {
      const result = await historyRepository.cancelTransaction(
        transactionId,
        "ON_RAMP",
      );
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
          <div className="w-full max-w-xs space-y-1">
            {statusConfig.showBankDetails && (
              <>
                {/* CLABE - PRIMERO */}
                <TileApp
                  title="CLABE"
                  subtitle={clabeValue}
                  subtitleClassName="text-xs font-mono text-[#020F1E] break-all"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <button
                      onClick={handleCopyClabe}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer flex-shrink-0"
                      title="Copiar CLABE"
                    >
                      {isCopiedClabe ? (
                        <BiCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <BiCopy className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  }
                />

                {/* Beneficiario */}
                <TileApp
                  title="A nombre de"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {beneficiaryNameValue || "—"}
                    </span>
                  }
                />
              </>
            )}

            {/* Información de montos y red */}
            {statusConfig.showAmounts && (
              <>
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

                {/* Monto Token primero */}
                <TileApp
                  title={`Recibirás (${tokenSymbol})`}
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {amountToken}
                    </span>
                  }
                />

                {/* Monto Fiat */}
                <TileApp
                  title="Monto a enviar"
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

                {/* ID de orden */}
                <TileApp
                  title="ID de orden"
                  titleClassName="text-xs text-[#666666]"
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

        {/* Footer */}
        <div className="flex-shrink-0 space-y-2 border-t border-gray-200 pt-2 mt-2">
          {statusConfig.showTransferMessage && (
            <p className="text-xs text-[#666666] text-center px-2">
              Realiza la transferencia y confirma una vez completada
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
