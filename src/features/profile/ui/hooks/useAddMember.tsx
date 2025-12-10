import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '../../../../shared/hooks/useDialog';
import type { ComboBoxOption } from '../../../../shared/components/ComboBoxApp';
import TileApp from '../../../../shared/components/TileApp';

export type RoleOption = {
    id: string;
    label: string;
};


export const useAddMember = () => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const roleOptions: RoleOption[] = useMemo(() => [
        { id: 'admin', label: 'Administrador' },
        { id: 'seller', label: 'Vendedor' },
        { id: 'cashier', label: 'Cajero' },
    ], []);

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Opciones de rol
    const roleOptionsCombo: ComboBoxOption[] = useMemo(() => roleOptions.map(role => ({
        id: role.id,
        component: (
            <TileApp
                title={role.label}

            />
        )
    })), [roleOptions]);

    // ✅ Obtener componente del rol seleccionado
    const selectedRoleComponent = useMemo(() => {
        const selected = roleOptions.find(option => option.id === selectedRole);
        return selected ? (
            <TileApp
                title={selected.label}
            />
        ) : <span className="text-gray-500">Selecciona un rol</span>;
    }, [roleOptions, selectedRole]);

    // ✅ Validar email
    const validateEmail = (emailValue: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(emailValue);
    };

    // ✅ Validar formulario
    const isFormValid = useMemo(() => {
        return fullName.trim() !== '' &&
            validateEmail(email) &&
            selectedRole !== '';
    }, [fullName, email, selectedRole]);

    // ✅ Manejar cambio de nombre
    const handleFullNameChange = useCallback((value: string) => {
        setFullName(value);
        setError(null);
    }, []);

    // ✅ Manejar cambio de email
    const handleEmailChange = useCallback((value: string) => {
        setEmail(value);
        setError(null);

        if (value && !validateEmail(value)) {
            setError('Correo electrónico inválido');
        }
    }, []);

    // ✅ Manejar selección de rol
    const handleRoleSelect = useCallback((option: ComboBoxOption) => {
        const selectId = option.id as string;
        setSelectedRole(selectId);
        setError(null);
    }, []);

    // ✅ Agregar miembro del equipo
    const handleAddMember = useCallback(async () => {
        if (!isFormValid) {
            setError('Por favor, completa todos los campos correctamente');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Reemplazar con llamada a API real
            // const response = await teamRepository.addMember({
            //     fullName,
            //     email,
            //     rol: selectedRole,
            // });

            console.log('Agregando miembro:', { fullName, email, rol: selectedRole });

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // ✅ Mostrar diálogo de éxito
            showDialog({
                title: 'Miembro agregado',
                subtitle: `${fullName} ha sido agregado al equipo exitosamente.`,
                hideBack: true,
                nextText: 'Aceptar',
                onNext: () => {
                    // Navegar de vuelta al equipo
                    navigate('/profile/team');
                },
            });

            // Reset del formulario
            setFullName('');
            setEmail('');
            setSelectedRole('');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al agregar miembro';
            setError(errorMessage);
            console.error('Error adding member:', err);

            showDialog({
                title: 'Error',
                subtitle: errorMessage,
                hideBack: true,
                nextText: 'Aceptar',
            });
        } finally {
            setIsLoading(false);
        }
    }, [fullName, email, selectedRole, isFormValid, showDialog, navigate]);

    return {
        fullName,
        handleFullNameChange,
        email,
        handleEmailChange,
        selectedRole,
        roleOptions,
        selectedRoleComponent,
        handleRoleSelect,
        handleAddMember,
        isLoading,
        error,
        isFormValid,
        roleOptionsCombo,
    };
};