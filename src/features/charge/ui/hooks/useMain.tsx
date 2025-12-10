import { useNavigate } from "react-router-dom"
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import { useCallback, useEffect, useState } from "react";
import type { Token } from "../../data/local/tokenLocalService";
import tokenRepository from "../../data/repositories/tokenRepository";

export const useMain = () => {
    const navigate = useNavigate();
    const {
        isAccountOptionsLoading
    } = useAccountOptions();

    const [tokens, setTokens] = useState<Token[]>([]);
    const [tokensError, setTokensError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const goToSelectToken = () => {
        navigate("/select-token");
    };

    const dynamicTokens = tokens
        .filter(token =>
            token.symbol.toUpperCase() === 'USDC' &&
            token.network.toLowerCase() === 'starknet'
        )
        .map(token => ({
            id: token.uuid,
            symbol: token.symbol,
            name: token.name,
            network: token.network,
            iconUrl: token.iconUrl
        }));


    const onHandleSend = () => {
        navigate("/select-token-dynamic", {
            state: {
                title: 'Selecciona tu token para transferir',
                tokens: dynamicTokens,
                transactionType: 'transfer'
            }
        });
    };

    const onHandleBuy = () => {
        navigate("/select-token-dynamic", {
            state: {
                title: 'Selecciona el token que deseas comprar',
                tokens: dynamicTokens,
                transactionType: 'buy'
            }
        });
    };

    const onHandleSell = () => {
        navigate("/select-token-dynamic", {
            state: {
                title: 'Selecciona el token que deseas vender',
                tokens: dynamicTokens,
                transactionType: 'sell'
            }
        });
    };

    const onHandleReceive = () => {
        navigate("/receive");
    };

    // Función para obtener tokens
    const fetchTokens = useCallback(async (): Promise<Token[]> => {
        try {
            // Simular API call
            const response = await tokenRepository.fetchTokens();

            if (response) {
                // Obtener tokens del repositorio
                const tokens = tokenRepository.getTokens();
                return tokens;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error('Failed to fetch tokens ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, []);

    // Cargar tokens
    const loadTokens = useCallback(async () => {
        try {
            setTokensError(null);
            setIsLoading(true);


            const fetchedTokens = await fetchTokens();
            setTokens(fetchedTokens);
            setIsLoading(false);
        } catch (error) {
            setTokensError(error instanceof Error ? error.message : 'Error loading tokens');
            setIsLoading(false);
            console.error('Error fetching tokens:', error);
        }
    }, [fetchTokens]);

    useEffect(() => {
        loadTokens();
    }, [loadTokens]);

    return {
        goToSelectToken,
        isAccountOptionsLoading,
        onHandleSend,
        onHandleBuy,
        onHandleSell,
        onHandleReceive,
        tokens,
        tokensError,
        isLoading,
        dynamicTokens,
    };
}