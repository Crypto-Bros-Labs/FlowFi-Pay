import React from "react";
import HeaderModal from "../../../../shared/components/HeaderModal";
import SwitchTabs from "../../../../shared/components/SwitchTabs";
import { useOnOffRamp } from "../hooks/useOnOffRamp";
import InputExchange from "./InputExchange";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import ModalWrapper from "../../../../shared/components/ModalWrapper";
import BuyInfoPanel from "./BuyInfoPanel";
import SellInfoPanel from "./SellInfoPanel";

interface OnOffRampPanelProps {
    isModal?: boolean;
    isFlow?: boolean;
}

const OnOffRampPanel: React.FC<OnOffRampPanelProps> = ({ isModal = false, isFlow = false }) => {
    const {
        activeTab,
        tabs,
        handleTabChange,
        amount,
        setShowCurrencySelector,
        amountFiat,
        setShowTokenSelector,
        handleChangeAmount,
        handleChangeAmountFiat,
        comboBoxOptions,
        selectedProviderId,
        selectedComponent,
        isLoading,
        onProviderSelect,
        walletAddresses,
        walletComboBoxOptions,
        selectedWalletAddress,
        onWalletSelect,
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect,
        showBuyInfoModal,
        showSellInfoModal,
        handleBuy,
        closeBuyModal,
        openSellModal,
        closeSellModal,
        selectedToken,
        selectedCurrency,
        isBuyLoading,
        buyError,
        canBuy,
    } = useOnOffRamp();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-[1.25rem] w-full h-[80vh] max-w-md p-4 flex flex-col border-2 border-[#3E5EF5] shadow-lg">

                <HeaderModal isModal={isModal} isFlow={isFlow} />

                <div className="flex mb-6 justify-center">
                    <div className="w-7/8 md:w-3/4">
                        <SwitchTabs
                            tabs={tabs}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />
                    </div>
                </div>

                {/* Contenedor con animación para las tabs */}
                <div className="relative overflow-hidden flex-1">

                    {/* TAB COMPRAR */}
                    <div
                        className={`
            absolute inset-0 flex flex-col p-1
            transition-all duration-300 ease-in-out
            ${activeTab === "onRamp"
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-full opacity-0 pointer-events-none'
                            }
        `}
                    >
                        <InputExchange
                            symbol={selectedCurrency?.symbol || "MXN"}
                            icon={<img src={"/mex.svg"} alt="MXN" className="w-full h-full" />}
                            value={amount}
                            onChange={handleChangeAmount}
                            onSelectToken={() => setShowTokenSelector(true)}
                            placeholder="0.00"
                            className="mb-4"
                        />

                        <InputExchange
                            symbol={selectedToken?.symbol || "MXNB"}
                            icon={<img src={"/mxnb.svg"} alt="BTC" className="w-full h-full" />}
                            value={amountFiat}
                            onChange={handleChangeAmountFiat}
                            onSelectToken={() => setShowCurrencySelector(true)}
                            placeholder="0.00"
                            className="mb-4"
                        />

                        <div className="mb-5">
                            <ComboBoxApp
                                options={comboBoxOptions}
                                selectedId={selectedProviderId}
                                onSelect={onProviderSelect}
                                selectedComponent={selectedComponent}
                            />
                        </div>

                        <div className="mb-6">
                            <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                                Cuenta destino
                            </div>

                            {walletAddresses && walletAddresses.length > 0 ? (
                                <ComboBoxApp
                                    options={walletComboBoxOptions}
                                    selectedId={selectedWalletAddress}
                                    onSelect={onWalletSelect}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => console.log('Agregar wallet')}
                                    className={`
                        w-full p-2.5 flex items-center justify-center gap-3
                        border border-[#666666] rounded-[10px]
                        bg-white text-left
                        transition-all duration-200 ease-in-out
                        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        cursor-pointer
                    `}
                                >
                                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-[#020F1E] mt-0.75">
                                        Agregar wallet
                                    </span>
                                </button>
                            )}
                        </div>


                        <div className="flex mt-auto justify-between items-center flex-col">
                            {buyError && (
                                <div className="text-red-500 text-sm mb-2">
                                    {buyError}
                                </div>
                            )}
                            <ButtonApp
                                text="Comprar"
                                textSize="text-sm"
                                paddingVertical="py-2"
                                isMobile={true}
                                onClick={() => { handleBuy(); }}
                                disabled={!canBuy()}
                                loading={isBuyLoading}
                                loadingText="Validando..."
                            />
                        </div>
                    </div>

                    {/* TAB VENDER */}
                    <div
                        className={`
            absolute inset-0 flex flex-col
            transition-all duration-300 ease-in-out
            ${activeTab === "offRamp"
                                ? 'translate-x-0 opacity-100'
                                : 'translate-x-full opacity-0 pointer-events-none'
                            }
        `}
                    >
                        <InputExchange
                            symbol={selectedToken?.symbol || "MXNB"}
                            icon={<img src={"/mxnb.svg"} alt="MXNB" className="w-full h-full" />}
                            value={amountFiat}
                            onChange={handleChangeAmountFiat}
                            onSelectToken={() => setShowCurrencySelector(true)}
                            placeholder="0.00"
                            className="mb-4"
                        />

                        <InputExchange
                            symbol={selectedCurrency?.symbol || "MXN"}
                            icon={<img src={"/mex.svg"} alt="MXN" className="w-full h-full" />}
                            value={amount}
                            onChange={handleChangeAmount}
                            onSelectToken={() => setShowTokenSelector(true)}
                            placeholder="0.00"
                            className="mb-4"
                        />

                        <div className="mb-5">
                            <ComboBoxApp
                                options={comboBoxOptions}
                                selectedId={selectedProviderId}
                                onSelect={onProviderSelect}
                                selectedComponent={selectedComponent}
                            />
                        </div>

                        <div className="mb-6">
                            <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
                                Cuenta bancaria
                            </div>

                            {bankAccounts && bankAccounts.length > 0 ? (
                                <ComboBoxApp
                                    options={bankComboBoxOptions}
                                    selectedId={selectedBankAccount}
                                    onSelect={onBankSelect}
                                />
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => console.log('Agregar banco')}
                                    className={`
                        w-full p-2.5 flex items-center justify-center gap-3
                        border border-[#666666] rounded-[10px]
                        bg-white text-left
                        transition-all duration-200 ease-in-out
                        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        cursor-pointer
                    `}
                                >
                                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-[#020F1E] mt-0.75">
                                        Agregar cuenta de banco
                                    </span>
                                </button>
                            )}
                        </div>

                        <div className="flex mt-auto">
                            <ButtonApp
                                text="Vender"
                                textSize="text-sm"
                                paddingVertical="py-2"
                                isMobile={true}
                                onClick={() => { openSellModal(); }}
                            />
                        </div>
                    </div>

                </div>

            </div>
            {showBuyInfoModal && (
                <ModalWrapper onClose={closeBuyModal}>
                    <BuyInfoPanel onClose={closeBuyModal} />
                </ModalWrapper>
            )}
            {showSellInfoModal && (
                <ModalWrapper onClose={closeSellModal}>
                    <SellInfoPanel onClose={closeSellModal} />
                </ModalWrapper>
            )}
        </>
    );
};

export default OnOffRampPanel;