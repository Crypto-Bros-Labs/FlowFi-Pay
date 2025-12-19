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
  const {
    qrData,
    amounts,
    /*cancelTransaction,
        isCancelLoading,
        walletData,
                */
  } = useSellInfo();

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

    // ✅ Resetear el estado después de 2 segundos
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
    <div className="bg-white rounded-[1.25rem] w-full h-[80vh] md:h-[90vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
      {/* Header - sin scroll */}
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
          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-2">
            {/* Título principal */}
            <div className="text-center mb-2 w-full py-2">
              <h1 className="text-2xl font-bold text-[#020F1E]">
                ¡Realiza el pago!
              </h1>
            </div>

            {/* QR Code */}
            <div className="mb-6 flex flex-col items-center w-full">
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
                title="Monto (Fiat)"
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

              {fullName != name && name && (
                <TileApp
                  title="Cajero"
                  titleClassName="text-base text-[#666666]"
                  trailing={
                    <>
                      <span className="text-base font-semibold text-[#020F1E]">
                        {name}
                      </span>
                    </>
                  }
                />
              )}
            </div>
          </div>

          {/* Footer - sin scroll (fijo al final) */}
          <div className="flex-shrink-0 space-y-3 border-t border-gray-200 pt-4 mt-4">
            {/* Leyenda */}
            <div className="px-2">
              <p className="text-sm text-[#666666] text-center">
                Muestra este QR a tu cliente para completar el cobro
              </p>
            </div>

            {/* Botón continuar */}
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
