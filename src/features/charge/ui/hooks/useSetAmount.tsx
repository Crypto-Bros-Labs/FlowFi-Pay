import { useState, useCallback, useMemo } from 'react';
import usdc from '/usdc.png';

interface Currency {
    symbol: string;
    code: string;
    name: string;
}

interface Token {
    symbol: string;
    name: string;
    imageUrl: string;
    price: number; // Precio en USD o la moneda base
}

export const useSetAmount = () => {
    const [amountFiat, setAmountFiat] = useState<string>('1000');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showSellInfoModal, setShowSellInfoModal] = useState<boolean>(false);

    // Mock data - reemplaza con tus datos reales
    const selectedCurrency: Currency = useMemo(() => ({
        symbol: '$',
        code: 'MXN',
        name: 'Peso Mexicano'
    }), []);

    const selectedToken: Token = useMemo(() => ({
        symbol: 'USDC',
        name: 'USD Coin',
        imageUrl: usdc,
        price: 20.15
    }), []);

    // Calcular el amount en token basado en el fiat
    const amountToken = useMemo(() => {
        const fiatValue = parseFloat(amountFiat) || 0;
        if (fiatValue === 0) return '0.00';

        const tokenAmount = fiatValue / selectedToken.price;
        return tokenAmount.toFixed(6); // 6 decimales para crypto
    }, [amountFiat, selectedToken.price]);

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