import type { BankAccount } from "../components/SellSection";
import type { DynamicToken } from "./useSelectTokenDynamic";
import { useState, useCallback, useMemo, useEffect } from 'react';
import { walletRepository } from '../../data/repositories/walletRepository';
import sellRepository from "../../../charge/data/repositories/sellRepository";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userRepository from "../../../login/data/repositories/userRepository";

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
    const [editingMode, setEditingMode] = useState<CurrencyMode>('fiat');

    // ✅ Estados para manejo de errores y respuesta de transferencia
    const [transferError, setTransferError] = useState<string>('');
    const [transferResponse, setTransferResponse] = useState<SendCryptoResponseData | null>(null);
    const [isTransferLoading, setIsTransferLoading] = useState(false);
    const [showModalTransferResult, setShowModalTransferResult] = useState(false);
    const { showDialog } = useDialog();


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
        if (editingMode === 'fiat') {
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
                }
            } catch (error) {
                console.error('Error fetching quote:', error);
                setQuoteError('Error obteniendo cotización');
                setAmountFiat('0');
            } finally {
                setIsQuoteLoading(false);
            }
        }
    }, [token.id, editingMode]);

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
            if (!selectedBankAccount) {
                setTransferError('Cuenta bancaria requerida');
                return;
            }

            setIsLoading(true);
            setTimeout(() => {
                console.log('Procesando venta:', {
                    amountFiat,
                    amountToken,
                    bankAccount: selectedBankAccount,
                });
                setIsLoading(false);
            }, 300);
        }
    }, [typeTransaction, transferAddress, showDialog, amountToken, token.id, amountFiat, selectedBankAccount]);

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

    };
};