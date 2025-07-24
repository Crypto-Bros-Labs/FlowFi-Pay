import React from "react";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import SelectTile from "../../../../shared/components/SelectTile";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useSelectToken } from "../hooks/useSelectToken";
import AppHeader from "../../../../shared/components/AppHeader";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import { BiHistory } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";

const SelectTokenPage: React.FC = () => {
    const {
        tokens,
        selectedToken,
        selectToken,
        handleBuy,
        isLoading,
    } = useSelectToken();

    const { goToHistory, goToProfile } = useAppBar();

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader

                title="Tokens"
                rightActions={[
                    {
                        icon: BiHistory,
                        onClick: goToHistory,
                        className: 'text-gray-700'
                    },
                    {
                        icon: IoPerson,
                        onClick: goToProfile,
                        className: 'text-gray-700'
                    },
                ]} />

            <div className="px-4">
                {/* Header/Title Section */}
                <DescriptionApp
                    title='Selecciona tu token para cobrar'
                />
            </div>

            {/* Contenedor con scroll para los tiles */}
            <div className="flex-1 overflow-y-auto py-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

            {/* Botones fixed en el bottom */}
            <div className="flex pt-4 pb-safe">
                <ButtonApp
                    text="Continuar"
                    textSize="text-sm"
                    paddingVertical="py-3"
                    isMobile={true}
                    onClick={handleBuy}
                />
            </div>
        </div>
    );
};

export default SelectTokenPage;