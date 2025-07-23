import { useState, useEffect } from 'react';
import TileApp from '../../../../shared/components/TileApp';
import type { ComboBoxOption } from '../../../../shared/components/ComboBoxApp';
import { formatCryptoAddress } from '../../../../shared/utils/cryptoUtils';

interface Network {
    id: string;
    name: string;
}

export const useAddWallet = () => {
    const [address, setAddress] = useState('');
    const [selectedNetworkId, setSelectedNetworkId] = useState<string>('');
    const [networks, setNetworks] = useState<Network[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock data de redes
    useEffect(() => {
        const fetchNetworks = async () => {
            await new Promise(resolve => setTimeout(resolve, 300));

            const mockNetworks: Network[] = [
                {
                    id: 'arbitrum',
                    name: 'Arbitrum One',

                },
                {
                    id: 'ethereum',
                    name: 'Ethereum',

                },
                {
                    id: 'bitcoin',
                    name: 'Bitcoin',

                },

                {
                    id: 'polygon',
                    name: 'Polygon',

                },
                {
                    id: 'optimism',
                    name: 'Optimism',

                },
                {
                    id: 'bsc',
                    name: 'Binance Smart Chain',
                }
            ];

            setNetworks(mockNetworks);

            if (mockNetworks.length > 0) {
                setSelectedNetworkId(mockNetworks[0].id);
            }
        };

        fetchNetworks();
    }, []);

    // Validar dirección según la red seleccionada
    const validateAddress = (addr: string, networkId: string): string => {
        if (!addr.trim()) return '';

        const cleanAddress = addr.trim();
        const selectedNetwork = networks.find(n => n.id === networkId);

        if (!selectedNetwork) return 'Selecciona una red válida';

        // Validaciones específicas por red
        switch (selectedNetwork.id) {
            case 'ethereum':
            case 'arbitrum':
            case 'polygon':
            case 'optimism':
            case 'bsc':
                // Validación de dirección Ethereum (EVM)
                {
                    const ethPattern = /^0x[a-fA-F0-9]{40}$/;
                    if (!ethPattern.test(cleanAddress)) {
                        return `Dirección de ${selectedNetwork.name} inválida. Debe comenzar con 0x y tener 42 caracteres.`;
                    }
                    break;
                }

            case 'bitcoin':
                // Validación de dirección Bitcoin
                {
                    const btcLegacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
                    const btcSegwitPattern = /^bc1[a-z0-9]{39,59}$/;
                    const btcP2SHPattern = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;

                    if (!btcLegacyPattern.test(cleanAddress) &&
                        !btcSegwitPattern.test(cleanAddress) &&
                        !btcP2SHPattern.test(cleanAddress)) {
                        return 'Dirección de Bitcoin inválida.';
                    }
                    break;
                }

            default:
                return 'Red no soportada';
        }

        return '';
    };

    // Manejar cambio en dirección
    const handleAddressChange = (value: string) => {
        setAddress(value);

        // Validar en tiempo real
        const validationError = validateAddress(value, selectedNetworkId);
        setError(validationError);
    };

    // Convertir redes a ComboBoxOptions
    const networkOptions: ComboBoxOption[] = networks.map(network => ({
        id: network.id,
        component: (
            <TileApp
                title={network.name}

            />
        )
    }));

    // Componente de red seleccionada
    const selectedNetworkComponent = () => {
        const selectedNetwork = networks.find(network => network.id === selectedNetworkId);

        if (!selectedNetwork) {
            return <span className="text-gray-500">Selecciona una red</span>;
        }

        return (
            <TileApp
                title={selectedNetwork.name}
            />
        );
    };

    // Manejar selección de red
    const handleNetworkSelect = (option: ComboBoxOption) => {
        const newNetworkId = option.id as string;
        setSelectedNetworkId(newNetworkId);

        // Re-validar dirección con la nueva red
        if (address) {
            const validationError = validateAddress(address, newNetworkId);
            setError(validationError);
        }
    };

    // Manejar envío del formulario
    const handleAddWallet = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Validar antes de enviar
            const validationError = validateAddress(address, selectedNetworkId);
            if (validationError) {
                setError(validationError);
                setIsLoading(false);
                return;
            }

            if (!selectedNetworkId) {
                setError('Selecciona una red');
                setIsLoading(false);
                return;
            }

            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const selectedNetwork = networks.find(network => network.id === selectedNetworkId);

            console.log('Wallet agregada:', {
                address,
                network: selectedNetwork,
                timestamp: new Date().toISOString()
            });

            // Simular éxito
            alert(`Wallet de ${selectedNetwork?.name} agregada exitosamente`);

            // Limpiar formulario
            setAddress('');
            setError('');

        } catch (err) {
            setError('Error al agregar el wallet. Intenta nuevamente.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Dirección formateada para mostrar
    const formattedAddress = address ? formatCryptoAddress(address, 'medium') : address;

    return {
        address,
        formattedAddress,
        handleAddressChange,
        selectedNetworkId,
        networkOptions,
        selectedNetworkComponent: selectedNetworkComponent(),
        handleNetworkSelect,
        handleAddWallet,
        isLoading,
        error,
        isFormValid: address.length > 0 && !error && selectedNetworkId
    };
};