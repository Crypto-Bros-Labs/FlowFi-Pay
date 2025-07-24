import { useState, useCallback, useMemo, useEffect } from 'react';
import tokenRepository from '../../data/repositories/tokenRepository';
import type { Token } from '../../data/local/tokenLocalService';
import sellRepository from '../../data/repositories/sellRepository';

interface Currency {
    symbol: string;
    code: string;
    name: string;
}



export const useSetAmount = () => {
    const [amountFiat, setAmountFiat] = useState<string>('1000');
    const [amountToken, setAmountToken] = useState<string>('0.00');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSellInfoModal, setShowSellInfoModal] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);


    // Mock data - reemplaza con tus datos reales
    const selectedCurrency: Currency = useMemo(() => ({
        symbol: '$',
        code: 'MXN',
        name: 'Peso Mexicano'
    }), []);

    const fetchQuote = useCallback(async (amountFiat: string, token: Token) => {
        try {
            // Simular una llamada a la API para obtener la cotización
        }
        catch (error) {
            console.error('Error fetching quote:', error);
            throw new Error('Failed to fetch quote');
        }
    }, []);


    // Validar si el amount es válido
    const isValidAmount = useMemo(() => {
        const fiatValue = parseFloat(amountFiat) || 0;
        return fiatValue > 0;
    }, [amountFiat]);

    // Manejar la entrada de números
    const handleNumberPress = useCallback((number: string) => {
        setAmountFiat(prev => {
            // Si el valor actual es '0', reemplazar con el nuevo número
            if (prev === '0') {
                return number;
            }

            // Verificar si ya hay un punto decimal
            if (number === '.' && prev.includes('.')) {
                return prev;
            }

            // Limitar a 2 decimales después del punto
            if (prev.includes('.')) {
                const [decimal] = prev.split('.');
                if (decimal && decimal.length >= 2) {
                    return prev;
                }
            }

            // Agregar el número
            return prev + number;
        });
    }, []);

    // Manejar el botón de borrar (delete)
    const handleDeletePress = useCallback(() => {
        setAmountFiat(prev => {
            if (prev.length <= 1) {
                return '0';
            }
            return prev.slice(0, -1);
        });
    }, []);

    // Manejar el botón de limpiar (clear)
    const handleClearPress = useCallback(() => {
        setAmountFiat('0');
    }, []);

    const handleDecimalPress = useCallback(() => {
        setAmountFiat(prev => {
            // Si ya hay un punto decimal, no hacer nada
            if (prev.includes('.')) {
                return prev;
            }
            // Si el valor actual es '0', reemplazar con '0.'
            if (prev === '0') {
                return '0.';
            }
            // Agregar el punto decimal
            return prev + '.';
        });
    }, []);

    // Manejar el botón continuar
    const handleContinue = useCallback(async () => {
        if (!isValidAmount) return;

        setIsLoading(true);
        try {
            // Aquí implementarías la lógica para continuar
            console.log('Amount Fiat:', amountFiat);
            console.log('Amount Token:', amountToken);
            console.log('Currency:', selectedCurrency);
            console.log('Token:', selectedToken);

            // Simular una llamada async
            await new Promise(resolve => setTimeout(resolve, 2000));

            openSellModal();

        } catch (error) {
            console.error('Error processing amount:', error);
        } finally {
            setIsLoading(false);
        }
    }, [amountFiat, amountToken, selectedCurrency, selectedToken, isValidAmount]);

    const openSellModal = () => setShowSellInfoModal(true);
    const closeSellModal = () => setShowSellInfoModal(false);

    useEffect(() => {
        const initializeData = () => {
            const token = tokenRepository.getSelectedToken();
            const initialAmountToken = sellRepository.getAmountToken() || '0.00';
            const initialAmountFiat = sellRepository.getAmountFiat() || '1000';

            setSelectedToken(token);
            setIsInitialized(true);
            setAmountToken(initialAmountToken);
            setAmountFiat(initialAmountFiat);
        };

        initializeData();
    }, []);

    return {
        amountFiat,
        amountToken,
        selectedCurrency,
        selectedToken,
        isLoading,
        handleNumberPress,
        handleDeletePress,
        handleClearPress,
        handleDecimalPress,
        handleContinue,
        isValidAmount,
        showSellInfoModal,
        openSellModal,
        closeSellModal,
    };
};