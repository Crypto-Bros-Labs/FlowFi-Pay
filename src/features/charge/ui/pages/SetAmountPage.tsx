import React from "react";
import { IoPerson } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import AppHeader from "../../../../shared/components/AppHeader";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useSetAmount } from "../hooks/useSetAmount";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import { truncateLeft } from "../../../../shared/utils/numberUtils";
import ModalWrapper from "../../../../shared/components/ModalWrapper";
import SellInfoPanel from "../components/SellInfoPanel";

const SetAmountPage: React.FC = () => {
    const {
        amountFiat,
        amountToken,
        selectedCurrency,
        selectedToken,
        isLoading,
        handleNumberPress,
        handleDeletePress,
        handleDecimalPress,
        handleContinue,
        isValidAmount,
        showSellInfoModal,
        closeSellModal,
        isQuoteLoading,
        handleContinueTransaction,
        isAccountOptionsLoading
    } = useSetAmount();

    const { goToHistory, goToProfile } = useAppBar();

    const NumberButton: React.FC<{ number: string; onClick: () => void }> = ({ number, onClick }) => (
        <button
            onClick={onClick}
            className="w-18 h-18 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center text-2xl font-medium text-gray-900"
        >
            {number}
        </button>
    );

    const ActionButton: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
        <button
            onClick={onClick}
            className="w-18 h-18 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center text-gray-600"
        >
            {children}
        </button>
    );

    if (isAccountOptionsLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <AppHeader
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
                    }
                ]}
            />

            <div className="flex-1 flex flex-col items-center justify-center px-4 mt-4">
                {/* Amount Display */}
                <div className="text-center mb-8">
                    {/* Fiat Amount */}
                    <div className="flex items-center justify-center mb-4 px-4">
                        <span className="text-xl font-medium text-gray-600 mr-2 flex-shrink-0">
                            {selectedCurrency?.code || '$'}
                        </span>
                        <span className="text-3xl font-light text-gray-900 max-w-[calc(100vw-8rem)] md:max-w-[calc(20vw-8rem)]">
                            {truncateLeft(amountFiat || '0', 10)}
                        </span>
                    </div>

                    {/* Token Amount */}
                    <div className="flex items-center justify-center px-4">
                        {selectedToken?.iconUrl && (
                            <img
                                src={selectedToken.iconUrl}

                                alt={selectedToken.symbol}
                                className="w-6 h-6 mr-2 flex-shrink-0"
                            />
                        )}
                        <span className="text-xl text-gray-500 truncate max-w-[calc(100vw-8rem)] md:max-w-[calc(20vw-8rem)]">
                            {amountToken || '0.00'}
                        </span>
                        {/* Inline Loading Spinner */}
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
                </div>
            </div>

            <div className="pb-2 flex flex-col">
                {/* Numeric Keypad */}
                <div className="grid grid-cols-3 px-4 w-full justify-items-center">
                    {/* Row 1 */}
                    <NumberButton number="1" onClick={() => handleNumberPress('1')} />
                    <NumberButton number="2" onClick={() => handleNumberPress('2')} />
                    <NumberButton number="3" onClick={() => handleNumberPress('3')} />

                    {/* Row 2 */}
                    <NumberButton number="4" onClick={() => handleNumberPress('4')} />
                    <NumberButton number="5" onClick={() => handleNumberPress('5')} />
                    <NumberButton number="6" onClick={() => handleNumberPress('6')} />

                    {/* Row 3 */}
                    <NumberButton number="7" onClick={() => handleNumberPress('7')} />
                    <NumberButton number="8" onClick={() => handleNumberPress('8')} />
                    <NumberButton number="9" onClick={() => handleNumberPress('9')} />

                    {/* Row 4 */}
                    <ActionButton onClick={handleDecimalPress}>
                        <span className="text-lg font-medium">.</span>
                    </ActionButton>
                    <NumberButton number="0" onClick={() => handleNumberPress('0')} />
                    <ActionButton onClick={handleDeletePress}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                        </svg>
                    </ActionButton>
                </div>
            </div>

            {/* Continue Button */}
            <div className="p-2">
                <ButtonApp
                    text="Cobrar"
                    paddingVertical="py-2"
                    textSize="text-base"
                    isMobile={true}
                    onClick={handleContinue}
                    loading={isLoading}
                    loadingText="Procesando..."
                    disabled={!isValidAmount || isLoading}
                />
            </div>


            {showSellInfoModal && (
                <ModalWrapper onClose={closeSellModal}>
                    <SellInfoPanel onClose={closeSellModal} onContinue={handleContinueTransaction} token={selectedToken!} />
                </ModalWrapper>
            )}
        </div>
    );
};

export default SetAmountPage;