import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import SelectTile from "../../../../shared/components/SelectTile";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useSelectToken } from "../hooks/useSelectToken";

interface SelectTokenPanelProps {
    isModal?: boolean;
    isFlow?: boolean;
}

const SelectTokenPanel: React.FC<SelectTokenPanelProps> = ({ isModal = false, isFlow = false }) => {
    const {
        tokens,
        selectedToken,
        selectToken,
        handleBuy,
        handleSell,
        isLoading,
    } = useSelectToken();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-[1.25rem] w-full h-[80vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">

            <HeaderModal isModal={isModal} isFlow={isFlow} />

            <DescriptionApp
                title='Selecciona tu token'
                description='Aqui puedes seleccionar el token que que quieras comprar o vender en la red que necesites'
            />

            {/* Contenedor con scroll para los tiles */}
            <div className="flex-1 overflow-y-auto p-2 mb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-3">
                    {tokens.map((token) => (
                        <SelectTile
                            key={token.id}
                            leading={
                                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                                    <img
                                        src={token.iconUrl}
                                        alt={token.symbol}
                                        className="w-8 h-8 object-cover"
                                        onError={(e) => {
                                            // Fallback si la imagen falla
                                            (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
                                                <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="100%" height="100%" fill="#f3f4f6"/>
                                                    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
                                                        ${token.symbol}
                                                    </text>
                                                </svg>
                                            `)}`;
                                        }}
                                    />
                                </div>
                            }
                            title={
                                <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${selectedToken === token.id ? 'text-white' : 'text-[#020F1E]'}`}>
                                        {token.symbol} •
                                    </span>
                                    <span className={`${selectedToken === token.id ? 'text-white' : 'text-[#495058]'}`}>
                                        {token.network}
                                    </span>
                                </div>
                            }
                            checked={selectedToken === token.id}
                            onClick={() => selectToken(token.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Botones en el bottom */}
            <div className="flex gap-3 pt-4 pb-2">
                <div className="flex flex-col w-1/2">
                    <ButtonApp
                        text="Comprar"
                        textSize="text-sm"
                        paddingVertical="py-2"
                        isMobile={true}
                        onClick={handleBuy}
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <ButtonApp
                        text="Vender"
                        textSize="text-sm"
                        paddingVertical="py-2"
                        isMobile={true}
                        onClick={handleSell}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectTokenPanel;