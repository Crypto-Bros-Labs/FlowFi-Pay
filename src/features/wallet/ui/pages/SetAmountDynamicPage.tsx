import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../../../../shared/components/AppHeader";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useSetAmountDynamic, type TransactionType } from "../hooks/useSetAmountDynamic";
import TransferSection from "../components/TransferSection";
import BuySection from "../components/BuySection";
import SellSection from "../components/SellSection";
import AvailableCryptoSection from "../components/AvailableCryptoSection";
import TransferResultModal from "../components/TransferResultModal";
import { truncateLeft } from "../../../../shared/utils/numberUtils";
import { CgSwapVertical } from "react-icons/cg";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

export interface SetAmountDynamicPageProps {
    title?: string;
    token?: DynamicToken;
    availableCrypto?: number;
    showSwitchCoin?: boolean;
    typeTransaction?: TransactionType;
    onContinue?: (amount: string, token: DynamicToken) => void;
}

const SetAmountDynamicPage: React.FC<SetAmountDynamicPageProps> = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAnimating, setIsAnimating] = useState(false);

    const title = props.title || location.state?.title;
    const token = props.token || location.state?.token;
    const availableCrypto = props.availableCrypto || location.state?.availableCrypto;
    const showSwitchCoin = props.showSwitchCoin !== undefined ? props.showSwitchCoin : location.state?.showSwitchCoin;
    const typeTransaction = props.typeTransaction || location.state?.typeTransaction || 'buy';
    const onContinue = props.onContinue || location.state?.onContinue;

    const {
        amountFiat,
        amountToken,
        selectedCurrency,
        isLoading,
        isMobile,
        transferAddress,
        setTransferAddress,
        selectedBankAccount,
        handleNumberPress,
        handleDeletePress,
        handleDecimalPress,
        handleInputChange,
        handleKeyDown,
        handleInputFocus,
        isValidAmount,
        handleContinue: hookHandleContinue,
        editingMode,
        handleSwitchCoin: hookHandleSwitchCoin,
        isQuoteLoading,
        transferResponse,
        isTransferLoading,
        handleCloseTransferModal,
        showModalTransferResult,
        errorBalance,
    } = useSetAmountDynamic(token, typeTransaction);

    const { formatedBalance,
    } = useProfile();


    // ✅ Manejar dirección escaneada
    useEffect(() => {
        if (location.state?.scannedAddress) {
            setTransferAddress(location.state.scannedAddress);
            window.history.replaceState({}, document.title);
        }
    }, [location.state.scannedAddress, setTransferAddress]);

    // ✅ Manejar switch coin con animación
    const handleSwitchCoin = () => {
        setIsAnimating(true);
        hookHandleSwitchCoin();
        setTimeout(() => setIsAnimating(false), 500);
    };

    if (!token) {
        return (
            <div className="flex flex-col h-full p-4">
                <AppHeader title="Error" onBack={() => navigate(-1)} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Token no disponible</p>
                </div>
            </div>
        );
    }

    const handleScanQR = () => {
        navigate('/wallet/qr-scanner', {
            state: {
                returnPath: location.pathname,
                title,
                token,
                availableCrypto,
                showSwitchCoin,
                typeTransaction,
                onContinue
            }
        });
    };

    const handleContinueClick = async () => {
        if (typeTransaction === 'transfer') {
            await hookHandleContinue();
        } else if (typeTransaction === 'sell' && !selectedBankAccount) {
            console.warn('Cuenta bancaria requerida');
            return;
        } else {
            if (onContinue) {
                onContinue(amountFiat, token);
            }
            await hookHandleContinue();
        }
    };

    const NumberButton: React.FC<{ number: string; onClick: () => void }> = ({ number, onClick }) => (
        <button
            onClick={onClick}
            className="w-16 h-16 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center text-xl font-medium text-gray-900"
        >
            {number}
        </button>
    );

    const ActionButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
        <button
            onClick={onClick}
            className="w-16 h-16 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center text-gray-600"
        >
            {children}
        </button>
    );

    return (
        <div className="h-9/10 md:h-12/12 lg:h-12/12 flex flex-col p-1">
            <AppHeader title={title} onBack={() => navigate(-1)} />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
                <div className="flex flex-col h-full">
                    {/* Available Crypto Section */}
                    {availableCrypto !== undefined && (
                        <div className="flex items-center gap-2 justify-center mb-6">
                            <AvailableCryptoSection
                                symbol={token.symbol}
                                amount={formatedBalance}
                                name={token.name}
                            />
                        </div>
                    )}

                    {/* Amount Display */}
                    <div className="flex-1 flex flex-col justify-center items-center mb-6">
                        <div className="flex justify-center items-center gap-4 w-full">
                            {showSwitchCoin && (
                                <button
                                    onClick={handleSwitchCoin}
                                    className={`
                                        flex-shrink-0 p-3
                                        hover:bg-blue-100 
                                        rounded-full 
                                        transition-all duration-300
                                        active:bg-blue-200
                                        ${isAnimating ? 'rotate-180 scale-110' : 'rotate-0 scale-100'}
                                    `}
                                    title="Cambiar moneda"
                                >
                                    <CgSwapVertical className="w-7 h-7 text-blue-600" />
                                </button>
                            )}

                            <div className="flex flex-col items-center">
                                {/* EDITABLE AMOUNT - Top */}
                                <div className="flex items-center justify-center mb-2 px-4">
                                    <div
                                        className={`transition-all duration-500 ease-in-out ${isAnimating
                                            ? 'opacity-0 scale-95 -translate-y-4'
                                            : 'opacity-100 scale-100 translate-y-0'
                                            }`}
                                    >
                                        {editingMode === 'fiat' ? (
                                            <>
                                                {!isMobile ? (
                                                    <div className="relative inline-flex items-center">
                                                        <span className="absolute left-3 text-lg font-medium text-gray-600 pointer-events-none z-10">
                                                            {selectedCurrency.code}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={truncateLeft(amountFiat || '0', 15)}
                                                            onChange={(e) => handleInputChange(e, 'fiat')}
                                                            onKeyDown={handleKeyDown}
                                                            onFocus={handleInputFocus}
                                                            className="text-2xl font-light text-gray-900 bg-transparent border border-gray-200 rounded-lg outline-none text-center pl-14 pr-4 py-2 min-w-[200px] max-w-[calc(100vw-8rem)] md:max-w-[400px] focus:border-blue-500 transition-colors"
                                                            placeholder="0"
                                                            style={{
                                                                width: `${Math.max(200, (amountFiat?.length || 1) * 20 + 100)}px`
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span className="text-lg font-medium text-gray-600 mr-2">
                                                            {selectedCurrency.code}
                                                        </span>
                                                        <span className="text-2xl font-light text-gray-900">
                                                            {truncateLeft(amountFiat || '0', 10)}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                {!isMobile ? (
                                                    <div className="relative inline-flex items-center">
                                                        <span className="absolute left-3 text-lg font-medium text-gray-600 pointer-events-none z-10">
                                                            {token.symbol}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            value={truncateLeft(amountToken || '0.00', 15)}
                                                            onChange={(e) => handleInputChange(e, 'crypto')}
                                                            onKeyDown={handleKeyDown}
                                                            onFocus={handleInputFocus}
                                                            className="text-2xl font-light text-gray-900 bg-transparent border border-gray-200 rounded-lg outline-none text-center pl-14 pr-4 py-2 min-w-[200px] max-w-[calc(100vw-8rem)] md:max-w-[400px] focus:border-blue-500 transition-colors"
                                                            placeholder="0"
                                                            style={{
                                                                width: `${Math.max(200, (amountToken?.length || 1) * 20 + 100)}px`
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span className="text-lg font-medium text-gray-600 mr-2">
                                                            {token.symbol}
                                                        </span>
                                                        <span className="text-2xl font-light text-gray-900">
                                                            {truncateLeft(amountToken || '0.00', 10)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CONVERTED AMOUNT - Bottom */}
                                <div className="flex items-center justify-center px-4">
                                    <div
                                        className={`transition-all duration-500 ease-in-out ${isAnimating
                                            ? 'opacity-0 scale-95 translate-y-4'
                                            : 'opacity-100 scale-100 translate-y-0'
                                            }`}
                                    >
                                        {editingMode === 'fiat' ? (
                                            <div className="flex items-center justify-center">
                                                {token.iconUrl && (
                                                    <img
                                                        src={token.iconUrl}
                                                        alt={token.symbol}
                                                        className="w-5 h-5 mr-2"
                                                    />
                                                )}
                                                <span className="text-lg text-gray-500 truncate max-w-[calc(100vw-8rem)] md:max-w-[calc(20vw-8rem)]">
                                                    {amountToken || '0.00'}
                                                </span>
                                                {isQuoteLoading && (
                                                    <svg
                                                        className="w-4 h-4 ml-2 animate-spin text-blue-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span className="text-lg text-gray-500 mr-2 truncate max-w-[calc(100vw-8rem)] md:max-w-[calc(20vw-8rem)]">
                                                    {amountFiat || '0'} {selectedCurrency.code}
                                                </span>
                                                {isQuoteLoading && (
                                                    <svg
                                                        className="w-4 h-4 ml-2 animate-spin text-blue-600"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 px-4 ">
                {/* ✅ Error Balance Message */}
                {errorBalance && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-sm font-medium text-red-600">
                            {errorBalance}
                        </p>
                    </div>
                )}
                {/* Transaction Type Sections */}
                {typeTransaction === 'transfer' && (
                    <TransferSection
                        address={transferAddress}
                        onChange={setTransferAddress}
                        onScanQR={handleScanQR}
                    />
                )}

                {typeTransaction === 'buy' && (
                    <BuySection availableBalance={1200.50} />
                )}

                {typeTransaction === 'sell' && (
                    <SellSection
                        bankAccount={selectedBankAccount}
                        onClick={() => console.log('Seleccionar cuenta bancaria')}
                    />
                )}

                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 mb-4 justify-items-center">
                    <NumberButton number="1" onClick={() => handleNumberPress('1')} />
                    <NumberButton number="2" onClick={() => handleNumberPress('2')} />
                    <NumberButton number="3" onClick={() => handleNumberPress('3')} />

                    <NumberButton number="4" onClick={() => handleNumberPress('4')} />
                    <NumberButton number="5" onClick={() => handleNumberPress('5')} />
                    <NumberButton number="6" onClick={() => handleNumberPress('6')} />

                    <NumberButton number="7" onClick={() => handleNumberPress('7')} />
                    <NumberButton number="8" onClick={() => handleNumberPress('8')} />
                    <NumberButton number="9" onClick={() => handleNumberPress('9')} />

                    <ActionButton onClick={handleDecimalPress}>
                        <span className="text-lg font-medium">.</span>
                    </ActionButton>
                    <NumberButton number="0" onClick={() => handleNumberPress('0')} />
                    <ActionButton onClick={handleDeletePress}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </ActionButton>
                </div>

                {/* Continue Button */}
                <ButtonApp
                    text="Continuar"
                    paddingVertical="py-3"
                    textSize="text-base"
                    isMobile={true}
                    onClick={handleContinueClick}
                    loading={isLoading || isTransferLoading}
                    disabled={!isValidAmount || isLoading || isTransferLoading}
                />
            </div>


            {/* Transfer Result Modal */}
            <TransferResultModal
                isOpen={showModalTransferResult}
                isSuccess={!!transferResponse}
                token={token}
                amountToken={amountToken}
                urlTransfer={transferResponse?.urlTransfer}
                hashTransfer={transferResponse?.hashTransfer}
                onClose={handleCloseTransferModal}
            />
        </div>
    );
};

export default SetAmountDynamicPage;