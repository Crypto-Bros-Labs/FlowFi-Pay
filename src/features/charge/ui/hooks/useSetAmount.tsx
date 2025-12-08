import { useState, useCallback, useMemo, useEffect } from 'react';
import tokenRepository from '../../data/repositories/tokenRepository';
import type { Token } from '../../data/local/tokenLocalService';
import sellRepository from '../../data/repositories/sellRepository';
import userRepository from '../../../login/data/repositories/userRepository';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../../../shared/hooks/useDialog';
import { useAccountOptions } from '../../../../shared/hooks/useAccountOptions';

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
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [orderUuid, setOrderUuid] = useState<string | null>(null);

    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const { isAccountOptionsLoading } = useAccountOptions();

    const selectedCurrency: Currency = useMemo(() => ({
        symbol: '$',
        code: 'MXN',
        name: 'Peso Mexicano'
    }), []);

    // Detectar si es móvil
    const checkIsMobile = useCallback(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isSmallScreen = window.innerWidth <= 768;
        setIsMobile(isMobileDevice || isSmallScreen);
    }, []);

    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [checkIsMobile]);

    // Manejar input desde teclado físico (solo desktop)
    // Manejar input desde teclado físico (solo desktop)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (isMobile) return; // Bloquear en móvil

        let value = e.target.value;

        // ✅ Si está vacío, establecer a '0'
        if (value === '') {
            value = '0';
        }

        // Validar que solo contenga números y un punto decimal
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value)) {
            // ✅ Si el valor anterior es '0' y el nuevo comienza con un dígito diferente a '0' o '.', reemplazarlo
            if (value.length > 1 && value.startsWith('0') && value[1] !== '.' && value[1] !== '0') {
                // Remover el leading zero
                value = value.substring(1);
            }
            setAmountFiat(value);
        }
    }, [isMobile]);

    // Manejar teclas del teclado físico (solo desktop)
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isMobile) {
            e.preventDefault();
            return;
        }

        // Permitir solo números, punto decimal, backspace, delete, tab, escape, enter y flechas
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (allowedKeys.includes(e.key)) {
            return;
        }

        // Permitir números (0-9)
        if (e.key >= '0' && e.key <= '9') {
            return;
        }

        // Permitir punto decimal solo si no hay uno ya
        if (e.key === '.' && !amountFiat.includes('.')) {
            return;
        }

        // Bloquear cualquier otra tecla
        e.preventDefault();
    }, [isMobile, amountFiat]);

    // Evitar que aparezca el teclado en móvil
    const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        if (isMobile) {
            e.target.blur(); // Quitar el foco inmediatamente en móvil
        }
    }, [isMobile]);

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
    // Manejar la entrada de números
    const handleNumberPress = useCallback((number: string) => {
        setAmountFiat(prev => {
            if (number === '.') {
                if (prev.includes('.')) {
                    return prev;
                }
                if (prev === '0') {
                    return '0.';
                }
                return prev + '.';
            }


            if (prev === '0' && number !== '.') {
                return number;
            }

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

    // ... resto de métodos existentes ...
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

            if (bankAccountUuid === 'default-bank-account') {
                showDialog({
                    title: 'Cuenta bancaria requerida',
                    subtitle: 'Por favor, agrega una cuenta bancaria antes de continuar.',
                    onNext: () => navigate('/add-account'),
                    nextText: 'Agregar',
                    backText: 'Cancelar',
                });
                return;
            }

            console.log('Orden de pago fija');
            tokenRepository.setSelectedToken(selectedToken);
            sellRepository.setAmounts({
                amountFiat,
                amountToken
            })
            sellRepository.setAmountFiat(amountFiat);
            sellRepository.setAmountToken(amountToken);

            const response = await sellRepository.createRecoveryOrder({
                userUuid: userUuid,
                tokenUuid: selectedToken?.uuid || 'default-network',
                fiatCurrencyUuid: '92b61c69-a81f-475a-9bc7-37c85efc74c6',
                fiatCurrencyAmount: amountFiat,
                tokenAmount: amountToken,
                exchangeValue: parseFloat(amountToken) / parseFloat(amountFiat),
            })
            if (response.success) {
                setOrderUuid(response.orderUuid);
                openSellModal();
            } else {
                console.error('Error creating off-ramp:', response);
                setQuoteError('Error al crear off-ramp');
                showDialog({
                    title: 'Error al crear la orden de cobro',
                    subtitle: 'Intenta nuevamente más tarde.',
                    nextText: 'Aceptar',
                    hideBack: true,
                });
                return;
            }


        } catch (error) {
            console.error('Error processing amount:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isValidAmount, isQuoteLoading, amountFiat, amountToken, selectedCurrency, selectedToken, showDialog, navigate]);

    const handleKycComplete = useCallback(() => {
        setShowKycModal(false);
        setKycCompleted(true);
        setKycUrl(null);
        openTimerModal();
    }, []);

    const handleKycCancel = useCallback(() => {
        setShowKycModal(false);
        setKycUrl(null);
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

            if (initialAmountFiat && initialAmountFiat !== '0') {
                setAmountFiat('0');
            } else {
                setAmountFiat('0');
            }

            setIsInitialized(true);
        };

        initializeData();
    }, []);

    return {
        // Estados existentes
        amountFiat,
        amountToken,
        selectedCurrency,
        selectedToken,
        isLoading,
        isQuoteLoading,
        quoteError,
        isValidAmount,
        showSellInfoModal,
        kycUrl,
        showKycModal,
        kycCompleted,
        showTimerModal,
        isAccountOptionsLoading,
        orderUuid,

        // Nuevo estado para móvil
        isMobile,

        // Métodos existentes del keypad
        handleNumberPress,
        handleDeletePress,
        handleClearPress,
        handleDecimalPress,
        handleContinue,

        // Nuevos métodos para input de desktop
        handleInputChange,
        handleKeyDown,
        handleInputFocus,

        // Métodos existentes
        retryQuote,
        openSellModal,
        closeSellModal,
        handleKycComplete,
        handleKycCancel,
        openTimerModal,
        closeTimerModal,
        handleContinueTransaction,
    };
};