import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import InfoCard from "../../../../shared/components/InfoCard";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useBuyInfo } from "../hooks/useBuyInfo";

interface BuyInfoPanelProps {
    onClose?: () => void;
}

const BuyInfoPanel: React.FC<BuyInfoPanelProps> = ({ onClose }) => {
    const {
        beneficiaryData,
        copyToClipboard,
    } = useBuyInfo();

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
                    ¡Compra Crypto!
                </h1>
            </div>

            {/* Información del beneficiario 
            <div className="mb-4">
                <p className="text-sm font-bold text-[#020F1E] mb-1">
                    Nombre de beneficiario:
                </p>
                <p className="text-sm font-medium text-[#666666] mb-4">
                    {beneficiaryData.name}
                </p>

                <p className="text-sm font-bold text-[#020F1E] mb-1">
                    Entidad:
                </p>
                <p className="text-sm font-medium text-[#666666]">
                    {beneficiaryData.entity}
                </p>
            </div>
            */}

            {/* Cards de información */}
            <div className="space-y-3 mb-6">
                {/* Card CLABE */}
                <InfoCard
                    title="Tu CLABE"
                    subtitle={beneficiaryData.clabe}
                    trailingIcon={
                        <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    }
                    onTap={copyToClipboard}
                    onIconTap={copyToClipboard}
                />

                {/* Card compartir 
                <InfoCard
                    title="Guardar todos los datos"
                    trailingIcon={
                        <svg className="w-5 h-5 text-[#666666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                    }
                    onTap={shareData}
                    onIconTap={shareData}
                />
                */}
            </div>

            {/* Leyenda */}
            <div className="mb-6">
                <p className="text-sm text-[#666666] text-center">
                    Esta es tu cuenta en donde puedes depositar para comprar crypto
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

export default BuyInfoPanel;