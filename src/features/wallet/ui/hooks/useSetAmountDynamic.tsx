import type { BankAccount } from "../components/SellSection";
import type { DynamicToken } from "./useSelectTokenDynamic";
import { useState, useCallback, useMemo, useEffect } from 'react';
import { Check } from "lucide-react";
import { walletRepository } from '../../data/repositories/walletRepository';
// import sellRepository from "../../../charge/data/repositories/sellRepository";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userRepository from "../../../login/data/repositories/userRepository";
import { useCurrency } from "../../../../shared/hooks/useCurrency";
import { useNavigate } from "react-router-dom";
import sellRepository from "../../../charge/data/repositories/sellRepository";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

export type TransactionType = 'transfer' | 'buy' | 'sell';
export type CurrencyMode = 'fiat' | 'crypto';

export interface SendCryptoResponseData {
    urlTransfer: string;
    hashTransfer: string;
}

export interface SetAmountDynamicPageParams {
    token: DynamicToken;
    availableCrypto?: number;
    showSwitchCoin?: boolean;
    typeTransaction: TransactionType;
    onContinue?: (amount: string, token: DynamicToken) => void;
    redirectPath?: string;
}

const MXN_UUID = '92b61c69-a81f-475a-9bc7-37c85efc74c6';

export const useSetAmountDynamic = (token: DynamicToken, typeTransaction: TransactionType) => {
    const [amountFiat, setAmountFiat] = useState<string>('0');
    const [amountToken, setAmountToken] = useState<string>('0.00');
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [transferAddress, setTransferAddress] = useState<string>('');
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | undefined>({
        id: '13',
        bankName: 'Nu bank',
        clabe: '1234567890123456789',
    });
    const [isQuoteLoading, setIsQuoteLoading] = useState(false);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const { currency, usdToMxnRate, mxnToUsdRate } = useCurrency();

    const [editingMode, setEditingMode] = useState<CurrencyMode>(
        typeTransaction === 'sell' ? 'fiat' : (currency === 'USD' ? 'crypto' : 'fiat')
    );
    // ✅ Estados para manejo de errores y respuesta de transferencia
    const [transferError, setTransferError] = useState<string>('');
    const [transferResponse, setTransferResponse] = useState<SendCryptoResponseData | null>(null);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [showModalTransferResult, setShowModalTransferResult] = useState(false);
    const { showDialog } = useDialog();
    const navigate = useNavigate();

    const { formatedBalance } = useProfile();

    const [errorBalance, setErrorBalance] = useState<string>('');

    useEffect(() => {
        const numericAmount = parseFloat(amountToken);
        console.log('Validando balance:', { formatedBalance, numericAmount });
        if (formatedBalance < numericAmount) {
            setErrorBalance('Fondos insuficientes, la cantidad excede tu balance disponible.');
        } else {
            setErrorBalance('');
        }
    }, [amountToken, formatedBalance]);



    // Estado para retirar 
    const [kycUrl, setKycUrl] = useState<string | null>(null);


    const selectedCurrency = useMemo(() => ({
        symbol: '$',
        code: 'MXN',
        name: 'Peso Mexicano'
    }), []);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor;
        const isMobileDevice = /android|webos|iphone|ipad|ipot|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
        const isSmallScreen = window.innerWidth <= 768;
        setIsMobile(isMobileDevice || isSmallScreen);
    }, []);

    const fetchQuote = useCallback(async (fiatAmount: string, cryptoAmount: string) => {
        if (typeTransaction === 'sell') {
            const numericAmount = parseFloat(fiatAmount);
            if (!numericAmount || numericAmount <= 0) {
                setAmountFiat('0');
                return;
            }

            setIsQuoteLoading(true);
            setQuoteError(null);

            try {
                // ✅ Usar la API para obtener el quote automáticamente
                const response = await sellRepository.getQuote({
                    providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                    fromUuuid: token.id || '',
                    toUuid: MXN_UUID,
                    amountFiat: fiatAmount
                });

                if (response.success && response.cryptoAmount) {
                    setAmountToken(response.cryptoAmount);
                } else {
                    setQuoteError('Error obteniendo cotización');
                    setAmountFiat('0');
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
                setQuoteError('Error obteniendo cotización');
                setAmountFiat('0');
            } finally {
                setIsQuoteLoading(false);
            }
            return;
        } else if (typeTransaction === 'buy' || typeTransaction === 'transfer') {

            if (editingMode === 'fiat') {
                const numericAmount = parseFloat(fiatAmount);
                if (!numericAmount || numericAmount <= 0) {
                    setAmountToken('0.00');
                    return;
                }

                setIsQuoteLoading(true);
                setQuoteError(null);

                try {
                    /*const response = await sellRepository.getQuote({
                        providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                        fromUuuid: token.id || '',
                        toUuid: MXN_UUID,
                        amountFiat: fiatAmount
                    });
    
                    if (response.success && response.cryptoAmount) {
                        setAmountToken(response.cryptoAmount);
                    } else {
                        setQuoteError('Error obteniendo cotización');
                        setAmountToken('0.00');
                    }
                        */
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const quote = numericAmount * mxnToUsdRate;
                    setAmountToken(quote.toFixed(6));
                } catch (error) {
                    console.error('Error fetching quote:', error);
                    setQuoteError('Error obteniendo cotización');
                    setAmountToken('0.00');
                } finally {
                    setIsQuoteLoading(false);
                }
            } else {
                const numericAmount = parseFloat(cryptoAmount);
                if (!numericAmount || numericAmount <= 0) {
                    setAmountFiat('0');
                    return;
                }

                setIsQuoteLoading(true);
                setQuoteError(null);

                try {
                    /*
                    const response = await sellRepository.getQuote({
                        providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                        fromUuuid: token.id || '',
                        toUuid: MXN_UUID,
                        amountFiat: cryptoAmount
                    });
    
                    if (response.success && response.cryptoAmount) {
                        setAmountFiat(response.cryptoAmount);
                    } else {
                        setQuoteError('Error obteniendo cotización');
                        setAmountFiat('0');
                    }*/
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const quote = numericAmount * usdToMxnRate;
                    setAmountFiat(quote.toFixed(2));
                } catch (error) {
                    console.error('Error fetching quote:', error);
                    setQuoteError('Error obteniendo cotización');
                    setAmountFiat('0');
                } finally {
                    setIsQuoteLoading(false);
                }
            }
        }
    }, [editingMode, mxnToUsdRate, token.id, typeTransaction, usdToMxnRate]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (editingMode === 'fiat') {
                fetchQuote(amountFiat, amountToken);
            } else {
                fetchQuote(amountFiat, amountToken);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [amountFiat, amountToken, editingMode, fetchQuote]);

    const handleSwitchCoin = useCallback(() => {
        setTimeout(() => {
            setEditingMode(prev => prev === 'fiat' ? 'crypto' : 'fiat');
        }, 500);
    }, []);

    const handleNumberPress = useCallback((number: string) => {
        if (editingMode === 'fiat') {
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
        } else {
            setAmountToken(prev => {
                if (number === '.') {
                    if (prev.includes('.')) {
                        return prev;
                    }
                    if (prev === '0.00' || prev === '0') {
                        return '0.';
                    }
                    return prev + '.';
                }

                if ((prev === '0.00' || prev === '0') && number !== '.') {
                    return number;
                }

                if (prev.includes('.')) {
                    const [, decimal] = prev.split('.');
                    if (decimal && decimal.length >= 4) {
                        return prev;
                    }
                }

                return prev + number;
            });
        }
    }, [editingMode]);

    const handleDeletePress = useCallback(() => {
        if (editingMode === 'fiat') {
            setAmountFiat(prev => {
                if (prev.length <= 1) {
                    return '0';
                }
                return prev.slice(0, -1);
            });
        } else {
            setAmountToken(prev => {
                if (prev.length <= 1) {
                    return '0.00';
                }
                return prev.slice(0, -1);
            });
        }
    }, [editingMode]);

    const handleClearPress = useCallback(() => {
        setAmountFiat('0');
        setAmountToken('0.00');
    }, []);

    const handleDecimalPress = useCallback(() => {
        if (editingMode === 'fiat') {
            setAmountFiat(prev => {
                if (prev.includes('.')) {
                    return prev;
                }
                if (prev === '0') {
                    return '0.';
                }
                return prev + '.';
            });
        } else {
            setAmountToken(prev => {
                if (prev.includes('.')) {
                    return prev;
                }
                if (prev === '0' || prev === '0.00') {
                    return '0.';
                }
                return prev + '.';
            });
        }
    }, [editingMode]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, mode: CurrencyMode) => {
        let value = e.target.value;

        if (value === '') {
            value = '0';
        }

        const regex = /^\d*\.?\d*$/;
        if (regex.test(value)) {
            if (value.length > 1 && value.startsWith('0') && value[1] !== '.' && value[1] !== '0') {
                value = value.substring(1);
            }

            if (mode === 'fiat') {
                setAmountFiat(value);
            } else {
                setAmountToken(value);
            }
        }
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End'
        ];

        if (allowedKeys.includes(e.key)) {
            return;
        }

        if (e.key >= '0' && e.key <= '9') {
            return;
        }

        if (e.key === '.' && !(editingMode === 'fiat' ? amountFiat : amountToken).includes('.')) {
            return;
        }

        e.preventDefault();
    }, [editingMode, amountFiat, amountToken]);

    const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        if (isMobile) {
            e.target.blur();
        }
    }, [isMobile]);

    const isValidAmount = useMemo(() => {
        const fiatValue = parseFloat(amountFiat) || 0;
        return fiatValue > 0;
    }, [amountFiat]);

    // ✅ Validación y envío de transferencia
    const handleContinue = useCallback(async () => {
        // Resetear errores previos
        setTransferError('');
        setTransferResponse(null);

        // Validación de dirección para transferencias
        if (typeTransaction === 'transfer') {
            if (!transferAddress || transferAddress.trim() === '') {
                const errorMessage = 'La dirección no puede estar vacía';
                setTransferError(errorMessage);
                showDialog({
                    title: 'No se puede realizar el envío',
                    subtitle: errorMessage,
                    nextText: 'Aceptar',
                });
                return;
            }

            // Proceder con el envío de crypto
            setIsTransferLoading(true);

            try {
                const cryptoAmountNum = parseFloat(amountToken) || 0;
                const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';


                // Llamar al repositorio
                const response = await walletRepository.sendCrypto(
                    userUuid, // Reemplazar con UUID real del usuario
                    token.id, // tokenNetworkUuid
                    cryptoAmountNum,
                    transferAddress
                );


                if (response.success) {
                    setTransferResponse({
                        urlTransfer: response.transactionURL || '',
                        hashTransfer: response.transactionHash || ''
                    });
                } else {
                    setTransferError('Algo salió mal');
                }
            } catch (error) {
                console.error('Error al enviar crypto:', error);
                setTransferError('Algo salió mal');
            } finally {
                setShowModalTransferResult(true);
                setIsTransferLoading(false);
            }
        } else if (typeTransaction === 'buy') {
            setIsLoading(true);
            setTimeout(() => {
                console.log('Procesando compra:', {
                    amountFiat,
                    amountToken,
                    typeTransaction,
                });
                setIsLoading(false);
            }, 300);
        } else if (typeTransaction === 'sell') {
            if (!isValidAmount || isQuoteLoading) return;

            setIsLoading(true);
            try {
                console.log('Amount Fiat:', amountFiat);
                console.log('Amount Token:', amountToken);
                console.log('Currency:', selectedCurrency);
                console.log('Token:', token);

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

                const response = await sellRepository.createOffRamp({
                    userUuid: userUuid,
                    providerUuid: '237b0541-5521-4fda-8bba-05ee4d484795',
                    tokenNetworkUuid: token?.id || 'default-network',
                    fiatCurrencyUuid: '92b61c69-a81f-475a-9bc7-37c85efc74c6',
                    userBankInformationUuid: bankAccountUuid,
                    amount: parseFloat(amountToken) || 0,
                })

                if (response.kycUrl !== null) {
                    setKycUrl(response.kycUrl);
                    switch (response.status) {
                        case 'UNKNOWN':
                            showDialog({
                                title: 'KYC Requerido',
                                subtitle: 'No has iniciado tu proceso de KYC o este está incompleto. Por favor, completa tu KYC para continuar con el retiro.',
                                onNext: () => window.open(`${response.kycUrl}`, '_blank'),
                                nextText: 'Iniciar KYC',
                                backText: 'Cancelar',
                            });
                            return;

                        case 'REVIEW':
                            showDialog({
                                title: 'KYC en revisión',
                                subtitle: 'Tu proceso de KYC está en revisión. Por favor, espera a que sea aprobado para continuar con el retiro.',
                                nextText: 'Aceptar',
                                hideBack: true,
                            });
                            return;

                        case 'DECLINED':
                            showDialog({
                                title: 'KYC Rechazado',
                                subtitle: 'Tu proceso de KYC ha sido rechazado. Por favor, vuelve a intentarlo para continuar con el retiro. Si necesitas ayuda, contacta al soporte.',
                                onNext: () => window.open(`${response.kycUrl}`, '_blank'),
                                nextText: 'Reintentar KYC',
                                backText: 'Cancelar',
                            });
                            return;

                        default:
                            console.warn('Estado de KYC desconocido:', response.status);
                            return;
                    }
                } else if (response.success && response.kycUrl === null) {
                    showDialog({
                        title: 'Transacción exitosa',
                        subtitle: 'Tu retiro ha sido procesado exitosamente. Se acreditará en tu cuenta bancaria en breve.',
                        hideBack: true,
                        nextText: 'Aceptar',
                        icon: <Check className="w-8 h-8 text-green-600" />
                        ,
                    });
                } else {
                    console.error('Error creating off-ramp:', response);
                    setQuoteError('Error al crear off-ramp');
                    showDialog({
                        title: 'Error al retirar fondos',
                        subtitle: 'Por el momento no se puede procesar tu solicitud. Inténtalo más tarde.',
                        hideBack: true,
                    });
                    return;
                }
            } catch (error) {
                console.error('Error processing amount:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [typeTransaction, transferAddress, showDialog, amountToken, token, amountFiat, isValidAmount, isQuoteLoading, selectedCurrency, navigate]);

    const handleCloseTransferModal = useCallback(() => {
        setShowModalTransferResult(false);
        setTransferResponse(null);
        setTransferError('');
    }, []);

    return {
        amountFiat,
        setAmountFiat,
        amountToken,
        setAmountToken,
        selectedCurrency,
        isTransferLoading,
        isLoading,
        isMobile,
        transferAddress,
        setTransferAddress,
        selectedBankAccount,
        setSelectedBankAccount,
        handleNumberPress,
        handleDeletePress,
        handleClearPress,
        handleDecimalPress,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        isValidAmount,
        handleContinue,
        token,
        editingMode,
        handleSwitchCoin,
        isQuoteLoading,
        quoteError,
        transferError,
        transferResponse,
        handleCloseTransferModal,
        showModalTransferResult,
        errorBalance,
        kycUrl,
    };
};