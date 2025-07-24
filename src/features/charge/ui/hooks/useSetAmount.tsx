import { useState, useCallback, useMemo, useEffect } from 'react';
import tokenRepository from '../../data/repositories/tokenRepository';
import type { Token } from '../../data/local/tokenLocalService';
import sellRepository from '../../data/repositories/sellRepository';
import userRepository from '../../../login/data/repositories/userRepository';
import { useNavigate } from 'react-router-dom';

interface Currency {
    symbol: string;
    code: string;
    name: string;
}

export const useSetAmount = () => {
    const [amountFiat, setAmountFiat] = useState<string>('0');
    const [amountToken, setAmountToken] = useState<string>('0.00');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [showSellInfoModal, setShowSellInfoModal] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [kycUrl, setKycUrl] = useState<string | null>(null);
    const [showKycModal, setShowKycModal] = useState<boolean>(false);
    const [kycCompleted, setKycCompleted] = useState<boolean>(false);
    const [showTimerModal, setShowTimerModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const selectedCurrency: Currency = useMemo(() => ({
        symbol: '$',
        code: 'MXN',
        name: 'Peso Mexicano'
    }), []);

    // Debounced quote fetching
    const fetchQuote = useCallback(async (fiatAmount: string) => {
        // No hacer quote si el amount es 0 o inválido
        const numericAmount = parseFloat(fiatAmount);
        if (!numericAmount || numericAmount <= 0) {
            setAmountToken('0.00');
            return;
        }

        setIsQuoteLoading(true);
        setQuoteError(null);

        try {
            const response = await sellRepository.getQuote({
                providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                fromUuuid: selectedToken?.uuid || '',
                toUuid: '92b61c69-a81f-475a-9bc7-37c85efc74c6',
                amountFiat: fiatAmount
            });

            if (response.success && response.cryptoAmount) {
                setAmountToken(response.cryptoAmount);
            } else {
                setQuoteError('Error obteniendo cotización');
            }
        } catch (error) {
            console.error('Error fetching quote:', error);
            setQuoteError('Error obteniendo cotización');
        } finally {
            setIsQuoteLoading(false);
        }
    }, [selectedToken?.uuid]);

    useEffect(() => {
        if (!isInitialized || !selectedToken) return;

        const timeoutId = setTimeout(() => {
            fetchQuote(amountFiat);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [amountFiat, fetchQuote, isInitialized, selectedToken]);

    // Validar si el amount es válido
    const isValidAmount = useMemo(() => {
        const fiatValue = parseFloat(amountFiat) || 0;
        return fiatValue > 0;
    }, [amountFiat]);

    // Manejar la entrada de números
    const handleNumberPress = useCallback((number: string) => {
        setAmountFiat(prev => {
            if (prev === '0') {
                return number;
            }

            if (number === '.' && prev.includes('.')) {
                return prev;
            }

            // Limitar a 2 decimales después del punto
            if (prev.includes('.')) {
                const [, decimal] = prev.split('.');
                if (decimal && decimal.length >= 2) {
                    return prev;
                }
            }

            return prev + number;
        });
    }, []);

    const handleDeletePress = useCallback(() => {
        setAmountFiat(prev => {
            if (prev.length <= 1) {
                return '0';
            }
            return prev.slice(0, -1);
        });
    }, []);

    const handleClearPress = useCallback(() => {
        setAmountFiat('0');
    }, []);

    const handleDecimalPress = useCallback(() => {
        setAmountFiat(prev => {
            if (prev.includes('.')) {
                return prev;
            }
            if (prev === '0') {
                return '0.';
            }
            return prev + '.';
        });
    }, []);

    const retryQuote = useCallback(() => {
        fetchQuote(amountFiat);
    }, [fetchQuote, amountFiat]);

    // Manejar el botón continuar
    const handleContinue = useCallback(async () => {
        if (!isValidAmount || isQuoteLoading) return;

        setIsLoading(true);
        try {
            console.log('Amount Fiat:', amountFiat);
            console.log('Amount Token:', amountToken);
            console.log('Currency:', selectedCurrency);
            console.log('Token:', selectedToken);

            const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';
            const bankAccountUuid = (await userRepository.getBankAccountUuid()) || 'default-bank-account';

            const response = await sellRepository.createOffRamp({
                userUuid: userUuid,
                providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                tokenNetworkUuid: selectedToken?.uuid || 'default-network',
                fiatCurrencyUuid: '92b61c69-a81f-475a-9bc7-37c85efc74c6',
                userBankInformationUuid: bankAccountUuid,
                amountFiat: parseFloat(amountFiat) || 0,
            })

            if (response.kycUrl !== null) {
                setKycUrl(response.kycUrl);
                setShowKycModal(true);
            } else if (response.success && response.kycUrl === null) {
                console.log('Off-ramp created successfully, no KYC required');
                sellRepository.setAmountFiat(amountFiat);
                sellRepository.setAmountToken(amountToken);
                openSellModal();
            } else {
                console.error('Error creating off-ramp:', response);
                setQuoteError('Error al crear off-ramp');
            }

        } catch (error) {
            console.error('Error processing amount:', error);
        } finally {
            setIsLoading(false);
        }
    }, [amountFiat, amountToken, selectedCurrency, selectedToken, isValidAmount, isQuoteLoading]);

    const handleKycComplete = useCallback(() => {
        setShowKycModal(false);
        setKycCompleted(true);
        setKycUrl(null);
        // Proceder al siguiente paso
        openTimerModal();
    }, []);

    // ✅ Manejar cancelación de KYC
    const handleKycCancel = useCallback(() => {
        setShowKycModal(false);
        setKycUrl(null);
        // Opcional: mostrar mensaje de que el KYC es requerido
        setQuoteError('KYC es requerido para continuar');
    }, []);

    const handleContinueTransaction = () => {
        closeSellModal();
        navigate('/history');
    }

    const openSellModal = () => setShowSellInfoModal(true);
    const closeSellModal = () => setShowSellInfoModal(false);
    const openTimerModal = () => setShowTimerModal(true);
    const closeTimerModal = () => setShowTimerModal(false);

    useEffect(() => {
        const initializeData = () => {
            const token = tokenRepository.getSelectedToken();
            const initialAmountToken = sellRepository.getAmountToken();
            const initialAmountFiat = sellRepository.getAmountFiat();

            setSelectedToken(token);
            setAmountToken(initialAmountToken);

            // ✅ Solo setear si hay un valor guardado, sino usar '0'
            if (initialAmountFiat && initialAmountFiat !== '0') {
                setAmountFiat(initialAmountFiat);
            } else {
                setAmountFiat('0');
            }

            setIsInitialized(true);
        };

        initializeData();
    }, []);

    return {
        amountFiat,
        amountToken,
        selectedCurrency,
        selectedToken,
        isLoading,
        isQuoteLoading,
        quoteError,
        retryQuote,
        handleNumberPress,
        handleDeletePress,
        handleClearPress,
        handleDecimalPress,
        handleContinue,
        isValidAmount,
        showSellInfoModal,
        openSellModal,
        closeSellModal,
        kycUrl,
        showKycModal,
        kycCompleted,
        handleKycComplete,
        handleKycCancel,
        showTimerModal,
        openTimerModal,
        closeTimerModal,
        handleContinueTransaction
    };
};