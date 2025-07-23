import { useCallback, useEffect, useState } from "react";
import type { ComboBoxOption } from "../../../../shared/components/ComboBoxApp";
import TileApp from "../../../../shared/components/TileApp";
import type { Currency, Provider, Token } from "../../data/local/tokenLocalService";
import tokenRepository from "../../data/repositories/tokenRepository";
import rampRepository from "../../data/repositories/rampRepository";
import userLocalService from "../../../login/data/local/userLocalService";
import { formatCurrency } from "../../../../shared/utils/numberUtils";

export const useOnOffRamp = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [showBuyInfoModal, setShowBuyInfoModal] = useState(false);
    const [showSellInfoModal, setShowSellInfoModal] = useState(false);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    //buy
    const [isBuyLoading, setIsBuyLoading] = useState(false);
    const [buyError, setBuyError] = useState<string | null>(null);

    //switch
    const [activeTab, setActiveTab] = useState("onRamp");

    const tabs = [
        { id: "onRamp", title: "Comprar" },
        { id: "offRamp", title: "Vender" }
    ];

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    //inputs
    const [amount, setAmount] = useState("0.00");
    const [showCurrencySelector, setShowCurrencySelector] = useState(false);
    const [amountFiat, setAmountFiat] = useState("0.00");
    const [showTokenSelector, setShowTokenSelector] = useState(false);

    const handleChangeAmount = (value: string) => {
        setAmount(value);
        setBuyError(null);

        const numericValue = parseFloat(value);
        const calculatedValue = numericValue * 1;
        setAmountFiat(formatCurrency(calculatedValue));
    }

    const handleChangeAmountFiat = (value: string) => {
        setAmountFiat(value);
        setBuyError(null);

        const numericValue = parseFloat(value);
        const calculatedValue = numericValue / 1;
        setAmount(formatCurrency(calculatedValue));
    };

    //providers
    const [providers, setProviders] = useState<Provider[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

    const fetchProviders = useCallback(async () => {
        setIsLoading(true);

        const response = await tokenRepository.fetchProviders(selectedToken?.uuid || '');
        // Datos mock
        if (response) {
            console.log('Proveedores obtenidos:', response);
            const mockProviders: Provider[] = tokenRepository.getProviders()

            setProviders(mockProviders);

            // Seleccionar el primer proveedor disponible
            const firstAvailable = mockProviders.find(provider => provider.isAvailable);
            if (firstAvailable) {
                console.log('Primer proveedor disponible:', firstAvailable);
                setSelectedProvider(firstAvailable);
                setSelectedProviderId(firstAvailable.id);
            }
        }
        else {
            setProviders(tokenRepository.getProviders());
            setSelectedProviderId(tokenRepository.getSelectedProvider()?.id || '');
            setSelectedProvider(tokenRepository.getSelectedProvider());
        }

        setIsLoading(false);
    }, [selectedToken]);

    // Convertir providers a ComboBoxOptions
    const comboBoxOptions: ComboBoxOption[] = providers.map(provider => ({
        id: provider.id,
        disabled: !provider.isAvailable,
        component: (
            <TileApp
                title={provider.name}
                leading={
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                        <img
                            src={provider.icon}
                            alt={provider.name}
                            className="w-full h-full object-cover"

                        />
                    </div>
                }
            />
        )
    }));

    // Componente para mostrar el proveedor seleccionado
    const selectedComponent = () => {
        const selectedProvider = providers.find(p => p.id === selectedProviderId);

        // Si no hay proveedor seleccionado pero hay providers, seleccionar el primero
        if (!selectedProvider && providers.length > 0) {
            const firstAvailable = providers.find(provider => provider.isAvailable);
            if (firstAvailable) {
                setSelectedProviderId(firstAvailable.id);
                return (
                    <TileApp
                        title="Proveedor"
                        trailing={
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                                    <img
                                        src={firstAvailable.icon}
                                        alt={firstAvailable.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm text-[#020F1E] font-medium">
                                    {firstAvailable.name}
                                </span>
                            </div>
                        }
                    />
                );
            }
        }

        if (!selectedProvider) {
            return (
                <span className="text-gray-500">No hay proveedores disponibles</span>
            );
        }

        return (
            <TileApp
                title="Proveedor"
                trailing={
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                            <img
                                src={selectedProvider.icon}
                                alt={selectedProvider.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-sm text-[#020F1E] font-medium">
                            {selectedProvider.name}
                        </span>
                    </div>
                }
            />
        );
    };

    const handleProviderSelect = (option: ComboBoxOption) => {
        setSelectedProviderId(option.id as string);
        const provider = providers.find(p => p.id === option.id);
        setSelectedProvider(provider || null);
    };

    const openBuyModal = () => setShowBuyInfoModal(true);
    const closeBuyModal = () => setShowBuyInfoModal(false);
    const openSellModal = () => setShowSellInfoModal(true);
    const closeSellModal = () => setShowSellInfoModal(false);

    const canBuy = (): boolean => {
        const amountValue = parseFloat(amount);
        const amountFiatValue = parseFloat(amountFiat);

        return (
            !isBuyLoading &&
            !isNaN(amountValue) &&
            !isNaN(amountFiatValue) &&
            amountValue > 0 &&
            amountFiatValue > 0 &&
            amount !== "0.00" &&
            amountFiat !== "0.00" &&
            amount !== "0" &&
            amountFiat !== "0"
        );
    };

    const handleBuy = async () => {
        if (!canBuy()) {
            setBuyError('Por favor, completa todos los campos correctamente antes de realizar la compra.');
            console.log('No se puede realizar la compra');
            return;
        }

        setIsBuyLoading(true);
        setBuyError(null);

        try {
            const response = await rampRepository.createOnRampTransaction({
                userUuid: userLocalService.getUserData().userUuid || '',
                providerUuid: selectedProvider?.uuid || '',
                tokenUuid: selectedToken?.uuid || '',
                amount: parseFloat(amount),
            });

            if (response) {
                rampRepository.clearAmounts();
                openBuyModal();
            } else {
                rampRepository.setAmounts({
                    amount: amount,
                    amountFiat: amountFiat
                });
                setBuyError('Es necesario iniciar sesión para realizar la compra.');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear la transacción';
            setBuyError(errorMessage);
            console.error('Error en handleBuy:', error);
        } finally {
            setIsBuyLoading(false);
        }
    };

    useEffect(() => {
        const initializeData = () => {
            const token = tokenRepository.getSelectedToken();
            const currency = tokenRepository.getSelectedCurrency();
            const initialAmount = rampRepository.getAmounts()?.amount || '0.00';
            const initialAmountFiat = rampRepository.getAmounts()?.amountFiat || '0.00';

            setSelectedToken(token);
            setSelectedCurrency(currency);
            setIsInitialized(true);
            setAmount(initialAmount);
            setAmountFiat(initialAmountFiat);
        };

        initializeData();
    }, []);

    useEffect(() => {
        if (isInitialized) {
            fetchProviders();
        }
    }, [isInitialized, selectedToken?.uuid, fetchProviders]);



    return {
        activeTab,
        tabs,
        handleTabChange,
        amount,
        setAmount,
        showCurrencySelector,
        setShowCurrencySelector,
        amountFiat,
        setAmountFiat,
        showTokenSelector,
        setShowTokenSelector,
        providers,
        comboBoxOptions,
        selectedProviderId,
        selectedComponent: selectedComponent(),
        isLoading,
        onProviderSelect: handleProviderSelect,
        showBuyInfoModal,
        showSellInfoModal,
        openBuyModal,
        closeBuyModal,
        openSellModal,
        closeSellModal,
        selectedToken,
        setSelectedToken,
        selectedCurrency,
        setSelectedCurrency,
        handleBuy,
        handleChangeAmount,
        handleChangeAmountFiat,
        isBuyLoading,
        buyError,
        canBuy,
    };
};