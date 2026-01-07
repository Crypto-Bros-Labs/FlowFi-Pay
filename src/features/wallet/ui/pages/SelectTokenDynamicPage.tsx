import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import SelectTile from "../../../../shared/components/SelectTile";
import ButtonApp from "../../../../shared/components/ButtonApp";
import AppHeader from "../../../../shared/components/AppHeader";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import { BiHistory } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { useSelectTokenDynamic, type DynamicToken } from "../hooks/useSelectTokenDynamic";

interface SelectTokenDynamicPageProps {
    title?: string;
    tokens?: DynamicToken[];
    redirectPath?: string;
    transactionType?: 'buy' | 'sell' | 'transfer';
    externalAddress?: boolean;
}

const SelectTokenDynamicPage: React.FC<SelectTokenDynamicPageProps> = ({
    title,
    tokens = [],
    redirectPath,
    transactionType,
    externalAddress,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    // ✅ Si no hay props, intentar obtener del state de location
    const passedTokens = tokens.length > 0
        ? tokens
        : (location.state?.tokens || []);

    const passedTitle = title || location.state?.title;
    const passedRedirectPath = redirectPath || location.state?.redirectPath;
    const passedTransactionType = transactionType || location.state?.transactionType;
    const passedExternalAddress = externalAddress ?? location.state?.externalAddress;

    const {
        selectedToken,
        selectToken,
        handleContinue,
        isTokenSelected
    } = useSelectTokenDynamic({
        tokens: passedTokens,
        redirectPath: passedRedirectPath,
        transactionType: passedTransactionType,
        externalAddress: passedExternalAddress,
    });

    const { goToHistory, goToProfile } = useAppBar();

    // ✅ Manejar continuar
    const handleContinueClick = () => {
        setIsLoading(true);

        // Simular pequeño delay
        setTimeout(() => {
            handleContinue();
            setIsLoading(false);
        }, 200);
    };

    if (passedTokens.length === 0) {
        return (
            <div className="flex flex-col h-full p-4">
                <AppHeader
                    title="Seleccionar token"
                    onBack={() => navigate(-1)}
                />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500 mb-4">No hay tokens disponibles</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-9/10 md:h-12/12 lg:h-12/12 flex flex-col p-4">
            <div className="flex flex-col h-full">
                {/* Header */}
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
                    ]}
                />

                {/* Descripción/Título */}
                <div className="px-4 mt-4">
                    <DescriptionApp
                        title={passedTitle}
                    />
                </div>

                {/* Lista de tokens - Scrollable */}
                <div className="flex-1 overflow-y-auto py-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <div className="space-y-3">
                        {passedTokens.map((token: DynamicToken) => (
                            <SelectTile
                                key={token.id}
                                leading={
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
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

                {/* Botón Continuar - Fixed */}
                <div className="flex pt-4 pb-safe">
                    <ButtonApp
                        text="Continuar"
                        textSize="text-sm"
                        paddingVertical="py-3"
                        isMobile={true}
                        onClick={handleContinueClick}
                        disabled={!isTokenSelected() || isLoading}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectTokenDynamicPage;