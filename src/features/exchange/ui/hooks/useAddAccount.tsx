import { useState, useEffect } from 'react';
import TileApp from '../../../../shared/components/TileApp';
import type { ComboBoxOption } from '../../../../shared/components/ComboBoxApp';

interface Bank {
    id: string;
    name: string;
    code: string;
}

export const useAddAccount = () => {
    const [clabe, setClabe] = useState('');
    const [selectedBankId, setSelectedBankId] = useState<string>('');
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Mock data de bancos mexicanos
    useEffect(() => {
        const fetchBanks = async () => {
            // Simular carga de bancos
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockBanks: Bank[] = [
                { id: '012', name: 'BBVA México', code: '012' },
                { id: '014', name: 'Santander', code: '014' },
                { id: '072', name: 'Banorte', code: '072' },
                { id: '002', name: 'Banamex', code: '002' },
                { id: '019', name: 'Banco Azteca', code: '019' },
                { id: '036', name: 'Inbursa', code: '036' },
                { id: '106', name: 'Banco Ahorro Famsa', code: '106' },
                { id: '137', name: 'Banco Afirme', code: '137' },
            ];

            setBanks(mockBanks);
        };

        fetchBanks();
    }, []);

    // Validar CLABE
    const validateClabe = (clabeNumber: string): string => {
        if (!clabeNumber) return '';

        // Remover espacios y caracteres no numéricos
        const cleanClabe = clabeNumber.replace(/\D/g, '');

        if (cleanClabe.length === 0) return '';

        if (cleanClabe.length < 18) {
            return 'La CLABE debe tener 18 dígitos';
        }

        if (cleanClabe.length > 18) {
            return 'La CLABE no puede tener más de 18 dígitos';
        }

        // Validar que los primeros 3 dígitos correspondan a un banco válido
        const bankCode = cleanClabe.substring(0, 3);
        const bankExists = banks.some(bank => bank.code === bankCode);

        if (!bankExists && banks.length > 0) {
            return 'Código de banco no válido en la CLABE';
        }

        // Algoritmo de validación de CLABE (dígito verificador)
        const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
        let sum = 0;

        for (let i = 0; i < 17; i++) {
            sum += parseInt(cleanClabe[i]) * weights[i];
        }

        const remainder = sum % 10;
        const checkDigit = remainder === 0 ? 0 : 10 - remainder;
        const providedCheckDigit = parseInt(cleanClabe[17]);

        if (checkDigit !== providedCheckDigit) {
            return 'CLABE inválida - dígito verificador incorrecto';
        }

        return '';
    };

    // Manejar cambio en CLABE
    const handleClabeChange = (value: string) => {
        // Permitir solo números y limitar a 18 caracteres
        const cleanValue = value.replace(/\D/g, '').substring(0, 18);
        setClabe(cleanValue);

        // Validar en tiempo real
        const validationError = validateClabe(cleanValue);
        setError(validationError);

        // Auto-seleccionar banco basado en CLABE
        if (cleanValue.length >= 3) {
            const bankCode = cleanValue.substring(0, 3);
            const matchingBank = banks.find(bank => bank.code === bankCode);
            if (matchingBank) {
                setSelectedBankId(matchingBank.id);
            }
        }
    };

    // Convertir bancos a ComboBoxOptions
    const bankOptions: ComboBoxOption[] = banks.map(bank => ({
        id: bank.id,
        component: (
            <TileApp
                title={bank.name}
            />
        )
    }));

    // Componente del banco seleccionado
    const selectedBankComponent = () => {
        const selectedBank = banks.find(bank => bank.id === selectedBankId);

        if (!selectedBank) {
            return <span className="text-gray-500">Selecciona un banco</span>;
        }

        return (
            <TileApp
                title={selectedBank.name}
            />
        );
    };

    // Manejar selección de banco
    const handleBankSelect = (option: ComboBoxOption) => {
        setSelectedBankId(option.id as string);
    };

    // Manejar envío del formulario
    const handleAddAccount = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Validar antes de enviar
            const validationError = validateClabe(clabe);
            if (validationError) {
                setError(validationError);
                setIsLoading(false);
                return;
            }

            if (!selectedBankId) {
                setError('Selecciona un banco');
                setIsLoading(false);
                return;
            }

            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const selectedBank = banks.find(bank => bank.id === selectedBankId);

            console.log('Cuenta agregada:', {
                clabe,
                bank: selectedBank,
                timestamp: new Date().toISOString()
            });

            // Simular éxito
            alert(`Cuenta de ${selectedBank?.name} agregada exitosamente`);

            // Limpiar formulario
            setClabe('');
            setSelectedBankId('');
            setError('');

        } catch (err) {
            setError('Error al agregar la cuenta. Intenta nuevamente.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Formatear CLABE para mostrar (con espacios cada 4 dígitos)
    const formattedClabe = clabe.replace(/(\d{4})(?=\d)/g, '$1 ');

    return {
        clabe,
        formattedClabe,
        handleClabeChange,
        selectedBankId,
        bankOptions,
        selectedBankComponent: selectedBankComponent(),
        handleBankSelect,
        handleAddAccount,
        isLoading,
        error,
        isFormValid: clabe.length === 18 && !error && selectedBankId
    };
};