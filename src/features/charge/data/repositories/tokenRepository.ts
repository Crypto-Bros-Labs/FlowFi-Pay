import tokenApiService from "../api/tokenApiService";
import tokenLocalService, { type Currency, type Provider, type Token } from "../local/tokenLocalService";

class TokenRepository {
    async fetchTokens(): Promise<boolean> {
        try {
            // 1. Fetch tokens from API
            const response = await tokenApiService.getTokens();

            console.log('Fetched tokens:', response);

            // 2. Verificar que response sea un array
            if (!Array.isArray(response)) {
                console.error('Expected array but got:', typeof response, response);
                return false;
            }

            // 3. Update local state usando map
            const tokens = response.map(token => ({
                id: token.tokenNetworkUuid || '',
                name: '',
                uuid: token.tokenNetworkUuid || '',
                address: token.address || '',
                symbol: token.symbol || '',
                network: token.network || '',
                iconUrl: token.imageUrl || '/mxnb.svg',
            }));
            tokenLocalService.setTokens(tokens);

            tokenLocalService.setSelectedToken(tokens[0] || null);

            return true;
        } catch (error) {
            console.error('Failed to fetch tokens:', error);
            return false;
        }
    }

    async fetchProviders(tokenUuid: string): Promise<boolean> {
        try {
            // Validar que tokenUuid no esté vacío o sea null/undefined
            if (!tokenUuid || tokenUuid.trim() === '') {

                // Solo establecer providers por defecto
                const defaultProviders = [
                    {
                        id: 'juno',
                        uuid: '',
                        name: 'Juno',
                        icon: '/muno.svg',
                        isAvailable: true
                    }
                ];

                tokenLocalService.setProviders(defaultProviders);
                tokenLocalService.setSelectedProvider(defaultProviders[0]);
                console.log('Default providers set:', defaultProviders);

                return true; // Retornar true porque se establecieron los providers por defecto
            }


            // Primero establecer providers por defecto
            const defaultProviders = [
                {
                    id: 'juno',
                    uuid: '',
                    name: 'Juno',
                    icon: '/muno.svg',
                    isAvailable: true
                }
            ];

            // Establecer providers por defecto
            tokenLocalService.setProviders(defaultProviders);
            tokenLocalService.setSelectedProvider(defaultProviders[0]);
            console.log('Default providers set:', defaultProviders);

            // Luego intentar fetch del API
            const response = await tokenApiService.getProviders(tokenUuid);

            if (Array.isArray(response) && response.length > 0) {
                const providers = response.map(provider => ({
                    id: 'juno',
                    uuid: provider.uuid || '',
                    name: provider.name || '',
                    icon: '/muno.svg',
                    isAvailable: true
                }));

                tokenLocalService.setProviders(providers);
                tokenLocalService.setSelectedProvider(providers[0]);
                console.log('API providers set:', providers);
            }

            return true;
        } catch (error) {
            console.error('Failed to fetch providers:', error);
            return false;
        }
    }

    clearAll(): void {
        tokenLocalService.clearAll();
    }

    getSelectedToken(): Token | null {
        return tokenLocalService.getSelectedToken();
    }

    getSelectedProvider(): Provider | null {
        return tokenLocalService.getSelectedProvider();
    }

    getSelectedCurrency(): Currency | null {
        return tokenLocalService.getSelectedCurrency();
    }

    setSelectedToken(token: Token | null): void {
        tokenLocalService.setSelectedToken(token);
    }

    setSelectedProvider(provider: Provider | null): void {
        tokenLocalService.setSelectedProvider(provider);
    }

    setSelectedCurrency(currency: Currency | null): void {
        tokenLocalService.setSelectedCurrency(currency);
    }

    getTokens(): Token[] {
        return tokenLocalService.getTokens();
    }

    getProviders(): Provider[] {
        return tokenLocalService.getProviders();
    }

    getCurrencies(): Currency[] {
        return tokenLocalService.getCurrencies();
    }

    setTokens(tokens: Token[]): void {
        tokenLocalService.setTokens(tokens);
    }

    setProviders(providers: Provider[]): void {
        tokenLocalService.setProviders(providers);
    }

    setCurrencies(currencies: Currency[]): void {
        tokenLocalService.setCurrencies(currencies);
    }
}


export default new TokenRepository();