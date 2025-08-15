import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import ButtonApp from "../../../../shared/components/ButtonApp";
import QRCode from "../../../../shared/components/QRCode";
import { useSellInfo } from "../hooks/useSellInfo";
import TileApp from "../../../../shared/components/TileApp";
import type { Token } from "../../data/local/tokenLocalService";

interface SellInfoPanelProps {
    onClose?: () => void;
    onContinue?: () => void;
    token: Token;
}

const SellInfoPanel: React.FC<SellInfoPanelProps> = ({ onClose, onContinue, token }) => {
    const {
        qrData,
        amounts,
    } = useSellInfo();

    return (
        <div className="bg-white rounded-[1.25rem] w-full h-[80vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">

            <HeaderModal
                isModal={true}
                onBack={onClose}
                onClose={onClose}
            />

            {/* Título principal */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#020F1E] mb-4">
                    ¡Realiza el pago!
                </h1>
            </div>

            {/* QR Code */}
            <div className="mb-15">
                <QRCode
                    data={qrData}
                    size={150}
                    className="mb-2"
                />
                <p className="text-xs text-gray-500 text-center">
                    Escanea para enviar crypto a esta dirección
                </p>
            </div>

            <div className="mb-6">
                <TileApp
                    title="Monto"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                        <>
                            <span className="text-base font-semibold text-[#020F1E]">{amounts?.amountFiat}</span>
                        </>
                    }
                    className="mb-3"
                />

                <TileApp
                    title={`Monto (${token.symbol})`}
                    titleClassName="text-base text-[#666666]"
                    trailing={
                        <>
                            <span className="text-base font-semibold text-[#020F1E]">{amounts?.amountToken}</span>
                        </>
                    }
                    className="mb-3"
                />

                <TileApp
                    title="Red"
                    titleClassName="text-base text-[#666666]"
                    trailing={
                        <>
                            <span className="text-base font-semibold text-[#020F1E]">{token?.network}</span>
                        </>
                    }
                />
            </div>

            <div className="mt-auto">
                {/* Leyenda */}
                <div className="mb-6 px-8">
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
    );
};

export default SellInfoPanel;