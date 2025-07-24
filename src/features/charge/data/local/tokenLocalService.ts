import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Provider {
    id: string;
    uuid: string;
    name: string;
    icon: string;
    isAvailable: boolean;
}

export interface Token {
    id: string;
    uuid: string;
    address: string;
    name: string;
    symbol: string;
    network: string;
    iconUrl: string;
}

export interface Currency {
    id: string;
    symbol: string;
    name: string;
    country: string;
    iconUrl: string;
}

interface TokenLocalState {
    // Lists
    providers: Provider[];
    tokens: Token[];
    currencies: Currency[];

    // Selected items
    selectedProvider: Provider | null;
    selectedToken: Token | null;
    selectedCurrency: Currency | null;

    // Actions for providers
    setProviders: (providers: Provider[]) => void;
    setSelectedProvider: (provider: Provider | null) => void;

    // Actions for tokens
    setTokens: (tokens: Token[]) => void;
    setSelectedToken: (token: Token | null) => void;

    // Actions for currencies
    setCurrencies: (currencies: Currency[]) => void;
    setSelectedCurrency: (currency: Currency | null) => void;

    // Reset actions
    clearAll: () => void;
}

const useTokenLocalService = create<TokenLocalState>()(
    persist(
        (set) => ({
            // Initial state
            providers: [
                {
                    id: 'juno',
                    uuid: '',
                    name: 'Juno',
                    icon: '/muno.svg',
                    isAvailable: true
                }
            ],
            tokens: [],
            currencies: [],
            selectedProvider: null,
            selectedToken: null,
            selectedCurrency: null,

            // Provider actions
            setProviders: (providers) => set({ providers }),
            setSelectedProvider: (selectedProvider) => set({ selectedProvider }),

            // Token actions
            setTokens: (tokens) => set({ tokens }),
            setSelectedToken: (selectedToken) => set({ selectedToken }),

            // Currency actions
            setCurrencies: (currencies) => set({ currencies }),
            setSelectedCurrency: (selectedCurrency) => set({ selectedCurrency }),

            // Reset all
            clearAll: () => set({
                providers: [],
                tokens: [],
                currencies: [],
                selectedProvider: null,
                selectedToken: null,
                selectedCurrency: null,
            }),
        }),
        {
            name: 'token-local-service',
            storage: {
                getItem: (name) => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
            partialize: (state) => ({
                providers: state.providers,
                tokens: state.tokens,
                currencies: state.currencies,
                selectedProvider: state.selectedProvider,
                selectedToken: state.selectedToken,
                selectedCurrency: state.selectedCurrency,
            } as TokenLocalState),
            // Opcional: versión para migraciones futuras
            version: 1,
        }
    )
);

class TokenLocalService {
    private useStore = useTokenLocalService;

    private get store() {
        return this.useStore.getState();
    }

    // Provider methods
    setProviders(providers: Provider[]) {
        this.store.setProviders(providers || []);
    }

    getProviders(): Provider[] {
        return this.store.providers || [];
    }

    setSelectedProvider(provider: Provider | null) {
        this.store.setSelectedProvider(provider);
    }

    getSelectedProvider(): Provider | null {
        return this.store.selectedProvider;
    }

    // Token methods
    setTokens(tokens: Token[]) {
        this.store.setTokens(tokens);
    }

    getTokens(): Token[] {
        return this.store.tokens;
    }

    setSelectedToken(token: Token | null) {
        this.store.setSelectedToken(token);
    }

    getSelectedToken(): Token | null {
        return this.store.selectedToken;
    }

    // Currency methods
    setCurrencies(currencies: Currency[]) {
        this.store.setCurrencies(currencies);
    }

    getCurrencies(): Currency[] {
        return this.store.currencies;
    }

    setSelectedCurrency(currency: Currency | null) {
        this.store.setSelectedCurrency(currency);
    }

    getSelectedCurrency(): Currency | null {
        return this.store.selectedCurrency;
    }

    // Utility getters
    findProviderById(id: string): Provider | undefined {
        return this.store.providers.find(provider => provider.id === id);
    }

    findTokenById(id: string): Token | undefined {
        return this.store.tokens.find(token => token.id === id);
    }

    findCurrencyById(id: string): Currency | undefined {
        return this.store.currencies.find(currency => currency.id === id);
    }

    clearAll() {
        this.store.clearAll();
    }
}

export default new TokenLocalService();