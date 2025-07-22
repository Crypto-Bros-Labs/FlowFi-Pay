import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import InfoCard from "../../../../shared/components/InfoCard";
import ButtonApp from "../../../../shared/components/ButtonApp";
import QRCode from "../../../../shared/components/QRCode";
import { useSellInfo } from "../hooks/useSellInfo";

interface SellInfoPanelProps {
    onClose?: () => void;
}

const SellInfoPanel: React.FC<SellInfoPanelProps> = ({ onClose }) => {
    const {
        walletData,
        formattedAddress,
        qrData,
        copyAddressToClipboard,
    } = useSellInfo();

    return (
        <div className="bg-white rounded-[1.25rem] w-full h-[80vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">

            <HeaderModal
                isModal={true}
                isFlow={true}
                onBack={onClose}
                onClose={onClose}
            />

            {/* Título principal */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#020F1E] mb-4">
                    ¡Vende Crypto!
                </h1>
            </div>

            {/* QR Code */}
            <div className="mb-6">
                <QRCode
                    data={qrData}
                    size={150}
                    className="mb-2"
                />
                <p className="text-xs text-gray-500 text-center">
                    Escanea para enviar crypto a esta dirección
                </p>
            </div>

            {/* Cards de información */}
            <div className="space-y-3 mb-6">
                {/* Card dirección */}
                <InfoCard
                    title="Tu dirección"
                    subtitle={formattedAddress}
                    trailingIcon={
                        <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    }
                    onTap={copyAddressToClipboard}
                    onIconTap={copyAddressToClipboard}
                />
            </div>

            {/* Leyenda */}
            <div className="mb-6">
                <p className="text-sm text-[#666666] text-center">
                    Esta es tu dirección para venta de crypto aquí puedes mandar las siguientes monedas{' '}
                    <span className="font-semibold">
                        [{walletData.supportedTokens.join(', ')}]
                    </span>
                </p>
            </div>

            {/* Botón continuar */}
            <div className="mt-auto">
                <ButtonApp
                    text="Continuar"
                    textSize="text-sm"
                    paddingVertical="py-2"
                    isMobile={true}
                    onClick={onClose}
                />
            </div>

        </div>
    );
};

export default SellInfoPanel;