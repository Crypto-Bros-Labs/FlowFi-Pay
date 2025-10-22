import { useState } from 'react';
import * as clabe from 'clabe-validator';
import TileApp from '../../../../shared/components/TileApp';
import type { ComboBoxOption } from '../../../../shared/components/ComboBoxApp';
import bankRepository from '../../data/repositories/bankRepository';
import userRepository from '../../../login/data/repositories/userRepository';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../../../shared/hooks/useDialog';
interface Bank {
    id: string;
    name: string;
    code: string;
}

export const useAddAccount = () => {
    const [clabeValue, setClabeValue] = useState('');
    const [selectedBankId, setSelectedBankId] = useState<string>('');
    const [banks, setBanks] = useState<Bank[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [autoDetectedBankName, setAutoDetectedBankName] = useState<string>('');
    const navigate = useNavigate();
    const { showDialog } = useDialog();

    // Validar CLABE usando clabe-validator
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

        // ✅ Usar clabe-validator para validar
        if (!clabe.clabe.validate(cleanClabe)) {
            return 'CLABE inválida';
        }

        return '';
    };

    // ✅ Función para detectar banco automáticamente
    const handleClabeComplete = (completeCLABE: string) => {
        try {
            const clabeTest = clabe.clabe.validate(completeCLABE);
            const bankName = clabeTest.bank || 'Banco Desconocido';

            setAutoDetectedBankName(bankName);

        } catch (err) {
            console.error('Error detecting bank:', err);
            setError('No se pudo detectar el banco automáticamente');
        }
    };

    // Manejar cambio en CLABE
    const handleClabeChange = (value: string) => {
        // Permitir solo números y limitar a 18 caracteres
        const cleanValue = value.replace(/\D/g, '').substring(0, 18);
        setClabeValue(cleanValue);

        // Validar en tiempo real
        const validationError = validateClabe(cleanValue);
        setError(validationError);

        // ✅ Auto-detectar banco cuando CLABE esté completa
        if (cleanValue.length === 18 && !validationError) {
            handleClabeComplete(cleanValue);
        } else if (cleanValue.length < 18) {
            // Limpiar selección si CLABE no está completa
            setSelectedBankId('');
            setAutoDetectedBankName('');
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

        if (!selectedBank && autoDetectedBankName) {
            return (
                <TileApp
                    title={autoDetectedBankName}
                    titleClassName="text-sm font-medium text-gray-900"
                />
            );
        }

        if (!selectedBank) {
            return <span className="text-gray-500">Completa tu CLABE</span>;
        }

        return (
            <TileApp
                title={autoDetectedBankName}
                titleClassName="text-sm font-medium text-gray-900"
            />
        );
    };

    // Manejar selección de banco
    const handleBankSelect = (option: ComboBoxOption) => {
        setSelectedBankId(option.id as string);
        setAutoDetectedBankName(''); // Limpiar auto-detección al seleccionar manualmente
    };

    // Manejar envío del formulario
    const handleAddAccount = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Validar antes de enviar
            const validationError = validateClabe(clabeValue);
            if (validationError) {
                setError(validationError);
                setIsLoading(false);
                return;
            }

            if (!selectedBankId && !autoDetectedBankName) {
                setError('Selecciona un banco');
                setIsLoading(false);
                return;
            }


            const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';
            const response = await bankRepository.addBankAccount({
                userUuid,
                clabe: clabeValue,
                bankName: autoDetectedBankName,
                country: 'MX',
            })

            if (response.success && response.data) {
                console.log('Cuenta agregada:', response.data);
                showDialog({
                    title: 'Cuenta Agregada',
                    subtitle: `Cuenta de ${autoDetectedBankName} agregada exitosamente`,
                    onNext: () => navigate('/main'),
                    onBack: () => navigate('/main'),
                    hideBack: true,
                })
            } else {
                setError(response.error || 'Error al agregar la cuenta');
                return;
            }

            // Limpiar formulario
            setClabeValue('');
            setSelectedBankId('');
            setAutoDetectedBankName('');
            setError('');

        } catch (err) {
            setError('Error al agregar la cuenta. Intenta nuevamente.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Formatear CLABE para mostrar (con espacios cada 4 dígitos)
    const formattedClabe = clabeValue.replace(/(\d{4})(?=\d)/g, '$1 ');

    return {
        clabe: clabeValue,
        formattedClabe,
        handleClabeChange,
        selectedBankId,
        bankOptions,
        selectedBankComponent: selectedBankComponent(),
        handleBankSelect,
        handleAddAccount,
        isLoading,
        error,
        isFormValid: clabeValue.length === 18 && !error && (selectedBankId || autoDetectedBankName),
        setBanks,
        autoDetectedBankName, // ✅ Exponer para usar en UI si es necesario
    };
};