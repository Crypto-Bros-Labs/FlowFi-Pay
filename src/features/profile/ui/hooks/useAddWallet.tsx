import { useState, useEffect, useMemo, useCallback } from 'react';
import TileApp from '../../../../shared/components/TileApp';
import type { ComboBoxOption } from '../../../../shared/components/ComboBoxApp';
import { formatCryptoAddress } from '../../../../shared/utils/cryptoUtils';
import savedWalletsRepository from '../../data/repositories/savedWalletsRepository';
import userRepository from '../../../login/data/repositories/userRepository';
import { useDialog } from '../../../../shared/hooks/useDialog';
import { useNavigate } from 'react-router-dom';

interface Network {
    id: string;
    name: string;
}

interface FormErrors {
    fullName: string;
    walletAlias: string;
    address: string;
    network: string;
}

export const useAddWallet = () => {
    const [fullName, setFullName] = useState('');
    const [walletAlias, setWalletAlias] = useState('');
    const [address, setAddress] = useState('');
    const [selectedNetworkId, setSelectedNetworkId] = useState<string>('');
    const [networks, setNetworks] = useState<Network[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // ✅ NUEVO: Estado de errores por campo
    const [errors, setErrors] = useState<FormErrors>({
        fullName: '',
        walletAlias: '',
        address: '',
        network: '',
    });

    const { showDialog } = useDialog();
    const navigate = useNavigate();

    // ✅ Mock data de redes
    useEffect(() => {
        const fetchNetworks = async () => {
            await new Promise(resolve => setTimeout(resolve, 300));

            const mockNetworks: Network[] = [
                {
                    id: 'stk',
                    name: 'StarkNet',
                },
                {
                    id: 'arbitrum',
                    name: 'Arbitrum',
                },
                {
                    id: 'solana',
                    name: 'Solana',
                },
                {
                    id: 'base',
                    name: 'Base',
                },
            ];

            setNetworks(mockNetworks);

            if (mockNetworks.length > 0) {
                setSelectedNetworkId(mockNetworks[0].id);
            }
        };

        fetchNetworks();
    }, []);

    // ✅ Validar dirección según la red seleccionada
    const validateAddress = useCallback((addr: string, networkId: string): string => {
        if (!addr.trim()) return '';

        const cleanAddress = addr.trim();
        const selectedNetwork = networks.find(n => n.id === networkId);

        if (!selectedNetwork) return 'Selecciona una red válida';

        switch (selectedNetwork.id) {
            // Redes EVM: Arbitrum y Base
            case 'arbitrum':
            case 'base': {
                const ethPattern = /^0x[a-fA-F0-9]{40}$/;
                if (!ethPattern.test(cleanAddress)) {
                    return `Dirección de ${selectedNetwork.name} inválida. Debe comenzar con 0x y tener exactamente 42 caracteres (20 bytes).`;
                }
                break;
            }

            // StarkNet
            case 'stk': {
                const starkPattern = /^0x[0-9a-fA-F]{1,64}$/;
                if (!starkPattern.test(cleanAddress)) {
                    return 'Dirección de StarkNet inválida. Debe ser un valor hexadecimal que comience con 0x y tenga hasta 64 caracteres.';
                }
                break;
            }

            // Solana
            case 'solana': {
                const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
                if (!solanaPattern.test(cleanAddress)) {
                    return 'Dirección de Solana inválida. Debe ser una cadena Base58 de 32 a 44 caracteres.';
                }
                break;
            }

            default:
                return 'Red no soportada';
        }

        return '';
    }, [networks]);

    // ✅ Validar nombre completo
    const validateFullName = (name: string): string => {
        if (!name.trim()) return '';

        const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;
        if (!namePattern.test(name.trim())) {
            return 'El nombre debe contener al menos 2 caracteres y solo letras.';
        }

        return '';
    };

    // ✅ Validar alias
    const validateWalletAlias = (alias: string): string => {
        if (!alias.trim()) return '';

        const aliasPattern = /^[a-zA-Z0-9\s]{2,20}$/;
        if (!aliasPattern.test(alias.trim())) {
            return 'El alias debe tener 2-20 caracteres (letras, números, espacios, guiones y guiones bajos).';
        }

        return '';
    };

    // ✅ Manejar cambio en nombre completo
    const handleFullNameChange = useCallback((value: string) => {
        setFullName(value);
        const validationError = validateFullName(value);
        setErrors(prev => ({
            ...prev,
            fullName: validationError
        }));
    }, []);

    // ✅ Manejar cambio en alias
    const handleWalletAliasChange = useCallback((value: string) => {
        setWalletAlias(value);
        const validationError = validateWalletAlias(value);
        setErrors(prev => ({
            ...prev,
            walletAlias: validationError
        }));
    }, []);

    // ✅ Manejar cambio en dirección
    const handleAddressChange = useCallback((value: string) => {
        setAddress(value);

        // Validar en tiempo real
        const validationError = validateAddress(value, selectedNetworkId);
        setErrors(prev => ({
            ...prev,
            address: validationError
        }));
    }, [selectedNetworkId, validateAddress]);

    // ✅ Convertir redes a ComboBoxOptions
    const networkOptions: ComboBoxOption[] = networks.map(network => ({
        id: network.id,
        component: (
            <TileApp
                title={network.name}
            />
        )
    }));

    // ✅ Componente de red seleccionada
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

    // ✅ Manejar selección de red
    const handleNetworkSelect = useCallback((option: ComboBoxOption) => {
        const newNetworkId = option.id as string;
        setSelectedNetworkId(newNetworkId);

        // Re-validar dirección con la nueva red
        if (address) {
            const validationError = validateAddress(address, newNetworkId);
            setErrors(prev => ({
                ...prev,
                address: validationError,
                network: ''
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                network: ''
            }));
        }
    }, [address, validateAddress]);

    // ✅ Validar formulario completo
    const isFormValid = useMemo(() => {
        const fullNameValid = fullName.trim() !== '' && !validateFullName(fullName);
        const aliasValid = walletAlias.trim() !== '' && !validateWalletAlias(walletAlias);
        const addressValid = address.trim() !== '' && !validateAddress(address, selectedNetworkId);
        const networkValid = selectedNetworkId !== '';

        return fullNameValid && aliasValid && addressValid && networkValid;
    }, [fullName, walletAlias, address, validateAddress, selectedNetworkId]);

    // ✅ Manejar envío del formulario
    const handleAddWallet = async () => {
        setIsLoading(true);

        try {
            // Validar todos los campos
            const fullNameError = validateFullName(fullName);
            const aliasError = validateWalletAlias(walletAlias);
            const addressError = validateAddress(address, selectedNetworkId);
            const networkError = !selectedNetworkId ? 'Selecciona una red' : '';

            // ✅ Actualizar todos los errores a la vez
            setErrors({
                fullName: fullNameError,
                walletAlias: aliasError,
                address: addressError,
                network: networkError,
            });

            // Si hay algún error, detener
            if (fullNameError || aliasError || addressError || networkError) {
                setIsLoading(false);
                return;
            }

            const selectedNetwork = networks.find(network => network.id === selectedNetworkId);
            const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';

            const walletData = {
                userUuid,
                fullName,
                alias: walletAlias,
                walletAddress: address,
                network: selectedNetwork?.name || '',
            };

            const success = await savedWalletsRepository.addWallet(walletData);

            if (!success) {
                console.log('Error al agregar la wallet');
                showDialog({
                    title: 'Error',
                    subtitle: 'No se pudo agregar la wallet. Por favor, intenta nuevamente.',
                    nextText: 'Aceptar',
                    hideBack: true,
                });
            } else {
                showDialog({
                    title: 'Wallet agregada',
                    subtitle: 'La wallet ha sido agregada exitosamente a tu perfil.',
                    nextText: 'Aceptar',
                    hideBack: true,
                    onNext: () => {
                        navigate('/main');
                    },
                });
                console.log('Wallet agregada:', walletData);

                // ✅ Limpiar formulario y errores
                setFullName('');
                setWalletAlias('');
                setAddress('');
                setErrors({
                    fullName: '',
                    walletAlias: '',
                    address: '',
                    network: '',
                });
            }

        } catch (err) {
            setErrors(prev => ({
                ...prev,
                fullName: 'Error al agregar el wallet. Intenta nuevamente.'
            }));
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Dirección formateada para mostrar
    const formattedAddress = address ? formatCryptoAddress(address, 'medium') : address;

    return {
        fullName,
        handleFullNameChange,
        walletAlias,
        handleWalletAliasChange,
        address,
        setAddress,
        formattedAddress,
        handleAddressChange,
        selectedNetworkId,
        networkOptions,
        selectedNetworkComponent: selectedNetworkComponent(),
        handleNetworkSelect,
        handleAddWallet,
        isLoading,
        errors,  // ✅ NUEVO: Retornar objeto de errores
        isFormValid
    };
};