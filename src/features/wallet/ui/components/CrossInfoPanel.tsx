import React, { useState } from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import TileApp from "../../../../shared/components/TileApp";
import { BiCheck, BiCopy } from "react-icons/bi";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { TransactionStatus } from "../../../history/ui/components/TileHistory";
import historyRepository from "../../../history/data/repositories/historyRepository";

export interface CrossRampInfoData {
  amountSource: string;
  amountTarget?: string;
  countryTarget: "MX" | "US";
  orderId: string;
  id: string;
  accountIdentifier: string;
  beneficiaryName: string;
  bankName: string;
  concept: string;
  status: TransactionStatus;
}

interface CrossInfoPanelProps {
  onClose?: () => void;
  onContinue?: () => void;
  crossRampData?: CrossRampInfoData;
  orderId?: string;
  accountIdentifier?: string;
  beneficiaryName?: string;
  bankName?: string;
  concept?: string;
}

const CrossInfoPanel: React.FC<CrossInfoPanelProps> = ({
  onClose,
  onContinue,
  crossRampData,
  orderId,
  accountIdentifier,
  beneficiaryName,
  bankName,
  concept,
}) => {
  const [isCopiedAccount, setIsCopiedAccount] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  const amountSource = crossRampData?.amountSource;
  const amountTarget = crossRampData?.amountTarget;
  const countryTarget = crossRampData?.countryTarget || "MX";
  const orderIdValue = crossRampData?.orderId || orderId;
  const accountIdentifierValue =
    crossRampData?.accountIdentifier || accountIdentifier;
  const beneficiaryNameValue =
    crossRampData?.beneficiaryName || beneficiaryName;
  const bankNameValue = crossRampData?.bankName || bankName;
  const conceptValue = crossRampData?.concept || concept;
  const status = crossRampData?.status || "pending";
  const transactionId = crossRampData?.id || "";

  const baseUrl = window.location.origin;
  const paymentLink = `${baseUrl}/cross-order/${orderIdValue}`;

  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case "completed":
        return {
          title: "¡Transferencia realizada!",
          subtitle: "Se ha completado tu transferencia exitosamente",
          buttonText: "Continuar",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
        };
      case "canceled":
        return {
          title: "Transferencia cancelada",
          subtitle: "Tu transacción ha sido cancelada",
          buttonText: "Volver",
          showBankDetails: true,
          showTransferMessage: false,
          showAmounts: true,
        };
      case "pending":
      default:
        return {
          title: "Completa tu transferencia",
          subtitle: "Transfiere los fondos a la siguiente cuenta bancaria",
          buttonText: "Continuar",
          showBankDetails: true,
          showTransferMessage: true,
          showAmounts: true,
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  const handleCopyAccountIdentifier = () => {
    navigator.clipboard.writeText(accountIdentifierValue || "");
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

  const handleCancelTransaction = async () => {
    setIsCancelLoading(true);
    try {
      const result = await historyRepository.cancelTransaction(
        transactionId,
        "CROSS_RAMP",
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
                {/* Identificador de cuenta */}
                <TileApp
                  title="Número de cuenta"
                  subtitle={accountIdentifierValue}
                  subtitleClassName="text-xs font-mono text-[#020F1E] break-all"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <button
                      onClick={handleCopyAccountIdentifier}
                      className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 cursor-pointer flex-shrink-0"
                      title="Copiar cuenta"
                    >
                      {isCopiedAccount ? (
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

                {/* Banco */}
                <TileApp
                  title="Banco"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {bankNameValue || "—"}
                    </span>
                  }
                />

                {/* Concepto */}
                <TileApp
                  title="Concepto"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {conceptValue || "—"}
                    </span>
                  }
                />
              </>
            )}

            {/* Información de montos y país destino */}
            {statusConfig.showAmounts && (
              <>
                {/* País destino */}
                <TileApp
                  title="País destino"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {countryTarget}
                    </span>
                  }
                />

                {/* Monto origen */}
                <TileApp
                  title="Monto a enviar"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {amountSource}
                    </span>
                  }
                />

                {/* Monto destino */}
                <TileApp
                  title="Monto a recibir"
                  titleClassName="text-sm text-[#666666]"
                  trailing={
                    <span className="text-sm font-semibold text-[#020F1E]">
                      {amountTarget}
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

export default CrossInfoPanel;
