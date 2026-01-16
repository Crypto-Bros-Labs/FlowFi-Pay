import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import QRCode from "../../../../shared/components/QRCode";
import TileApp from "../../../../shared/components/TileApp";
import { useExternalSellInfo } from "../hooks/useExternalSellInfo";
import type { SellData } from "../../../charge/data/local/sellLocalService";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import { BiCheck, BiCopy } from "react-icons/bi";

interface SellInfoPanelProps {
  onClose?: () => void;
  onContinue?: () => void;
  token?: DynamicToken;
  sellData?: SellData;
}

const ExternalSellInfoPanel: React.FC<SellInfoPanelProps> = ({
  onClose,
  onContinue,
  token,
  sellData,
}) => {
  const { qrData, amounts, cancelTransaction, isCancelLoading } =
    useExternalSellInfo({ sellData });
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(sellData?.destinationWalletAddress ?? "");
    setIsCopied(true);

    // ✅ Resetear el estado después de 2 segundos
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-[1.25rem] w-full h-[80vh] md:h-[90vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header - sin scroll */}
      <HeaderModal isModal={true} onBack={onClose} onClose={onClose} />

      {/* Contenido scrollable - Solo QR y info */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center">
        {/* Título principal */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#020F1E] mb-4">
            ¡Realiza el pago!
          </h1>
        </div>

        {/* QR Code */}
        <div className="mb-6 flex flex-col items-center">
          <QRCode data={qrData} size={150} className="mb-2" />
          <p className="text-xs text-gray-500 text-center">
            Escanea para enviar crypto a esta dirección
          </p>
        </div>

        {/* Información de montos y red */}
        <div className="w-full max-w-xs">
          <TileApp
            title={formatCryptoAddressCustom(
              sellData?.destinationWalletAddress ?? "",
              15,
              4
            )}
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
          <TileApp
            title="Monto"
            titleClassName="text-base text-[#666666]"
            trailing={
              <>
                <span className="text-base font-semibold text-[#020F1E]">
                  {amounts?.amountFiat} MXN
                </span>
              </>
            }
            className="mb-3"
          />

          <TileApp
            title={`Monto (${token!.symbol})`}
            titleClassName="text-base text-[#666666]"
            trailing={
              <>
                <span className="text-base font-semibold text-[#020F1E]">
                  {amounts?.amountToken}
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
                  {token?.network}
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
            const success = await cancelTransaction(sellData?.id || "");
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
