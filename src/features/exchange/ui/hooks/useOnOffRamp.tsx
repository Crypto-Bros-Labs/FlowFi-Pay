import { useCallback, useEffect, useState } from "react";
import type { ComboBoxOption } from "../../../../shared/components/ComboBoxApp";
import TileApp from "../../../../shared/components/TileApp";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { Currency, Provider, Token } from "../../data/local/tokenLocalService";
import tokenRepository from "../../data/repositories/tokenRepository";
import rampRepository from "../../data/repositories/rampRepository";
import userLocalService from "../../../login/data/local/userLocalService";
import { formatCurrency } from "../../../../shared/utils/numberUtils";

interface OnOffRampWalletAddress {
    id: string;
    address: string;
    network: string;
}

interface OnOffRampBankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
}

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

    // wallet adress
    const [walletAddresses, setWalletAddresses] = useState<OnOffRampWalletAddress[]>([]);
    const [selectedWalletAddress, setSelectedWalletAddress] = useState<string>('');

    const fetchWalletAddresses = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockAddresses: OnOffRampWalletAddress[] = [
            {
                id: 'addr-1',
                address: '0x9Fc5b510185E7a218A2e5BDc8F7A14a2B8b90F123',
                network: 'Arbitrum'
            },
            {
                id: 'addr-2',
                address: '0xA7b2C5d8F3e4B9c6D1E8f5A2B9C6d3E8F1A4B7C5',
                network: 'Arbitrum'
            },
            {
                id: 'addr-3',
                address: '0x1234567890ABCDEF1234567890ABCDEF12345678',
                network: 'Arbitrum'
            }
        ];

        setWalletAddresses(mockAddresses);

        if (mockAddresses.length > 0) {
            setSelectedWalletAddress(mockAddresses[0].id);
        }
        setIsLoading(false);
    };

    // Convertir wallet addresses a ComboBoxOptions
    const walletComboBoxOptions: ComboBoxOption[] = [
        ...walletAddresses.map(wallet => ({
            id: wallet.id,
            component: (
                <TileApp
                    title={"Red"}
                    subtitle={wallet.network}
                    leading={
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                    }
                    trailing={
                        <span className="text-xs font-medium text-[#666666] truncate">
                            {formatCryptoAddress(wallet.address)}
                        </span>
                    }
                />
            )
        })),
        {
            id: 'add-wallet',
            component: (
                <div
                    onClick={() => {
                        console.log('Agregar wallet');
                        // Aquí puedes navegar a agregar wallet o abrir modal
                        // navigate('/add-wallet');
                        // setShowAddWalletModal(true);
                    }}
                    className={`
                        w-full p-1 flex items-center gap-3
                        bg-white text-left justify-center
                        transition-all duration-150 ease-in-out
                        hover:bg-gray-50 cursor-pointer
                        rounded-none
                    `}
                >
                    {/* Icono de más */}
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>

                    {/* Texto centrado */}
                    <span className="text-sm font-bold text-[#020F1E] mt-0.75">
                        Agregar wallet
                    </span>
                </div>
            )
        },
    ];

    const handleWalletSelect = (option: ComboBoxOption) => {
        if (option.id === 'add-wallet') {
            console.log('Acción: Agregar nueva wallet');
            return;
        }
        setSelectedWalletAddress(option.id as string);
    };

    // bank account
    const [bankAccounts, setBankAccounts] = useState<OnOffRampBankAccount[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<string>('');

    const fetchBankAccounts = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockBankAccounts: OnOffRampBankAccount[] = [
            {
                id: 'bank-1',
                bankName: 'BBVA',
                accountNumber: '1234567890123456',
            },
            {
                id: 'bank-2',
                bankName: 'Santander',
                accountNumber: '9876543210987654',
            },
            {
                id: 'bank-3',
                bankName: 'Banorte',
                accountNumber: '5555444433332222',
            }
        ];

        setBankAccounts(mockBankAccounts);

        if (mockBankAccounts.length > 0) {
            setSelectedBankAccount(mockBankAccounts[0].id);
        }
        setIsLoading(false);
    };

    // Convertir bank accounts a ComboBoxOptions
    const bankComboBoxOptions: ComboBoxOption[] = [
        ...bankAccounts.map(bank => ({
            id: bank.id,
            component: (
                <TileApp
                    title={"Banco"}
                    subtitle={bank.bankName}
                    leading={
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                    }
                    trailing={
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-[#020F1E] truncate">
                                No. de cuenta
                            </span>
                            <span className="text-xs font-medium text-[#666666] truncate">
                                **** {bank.accountNumber.slice(-4)}
                            </span>
                        </div>
                    }
                />
            )
        })),
        {
            id: 'add-bank',
            component: (
                <div
                    onClick={() => {
                        console.log('Agregar banco');
                    }}
                    className={`
                        w-full p-2.5 flex items-center gap-3
                        bg-white text-left justify-center
                        transition-all duration-150 ease-in-out
                        hover:bg-gray-50 cursor-pointer
                        rounded-none
                    `}
                >
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-[#020F1E] flex-1">
                        Agregar cuenta de banco
                    </span>
                </div>
            )
        }
    ];

    const handleBankSelect = (option: ComboBoxOption) => {
        if (option.id === 'add-bank') {
            console.log('Acción: Agregar nuevo banco');
            return;
        }
        setSelectedBankAccount(option.id as string);
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

    useEffect(() => {
        if (isInitialized) {
            fetchWalletAddresses();
            fetchBankAccounts();
        }
    }, [isInitialized]);

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
        walletAddresses,
        walletComboBoxOptions,
        selectedWalletAddress,
        onWalletSelect: handleWalletSelect,
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect: handleBankSelect,
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