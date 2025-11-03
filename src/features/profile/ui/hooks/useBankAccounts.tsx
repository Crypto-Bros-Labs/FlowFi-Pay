import { useState, useCallback } from 'react';
import { useDialog } from '../../../../shared/hooks/useDialog';
import { useAccountOptions } from '../../../../shared/hooks/useAccountOptions';

export const useBankAccounts = () => {
    const { showDialog } = useDialog();
    const {
        bankAccounts,
        isAccountOptionsLoading,
        selectedBankAccount,
        onBankSelect,
    } = useAccountOptions();
    const [isDeletingBank, setIsDeletingBank] = useState(false);

    // ✅ Manejar selección de banco
    const handleSelectBank = useCallback((bankId: string) => {
        onBankSelect(bankId);
    }, [onBankSelect]);

    // ✅ Manejar eliminación de cuenta bancaria
    const handleDeleteBank = useCallback((bankId: string) => {
        showDialog({
            title: "Eliminar cuenta bancaria",
            subtitle: "¿Estás seguro de que quieres eliminar esta cuenta bancaria?",
            onNext: async () => {
                setIsDeletingBank(true);
                try {
                    // await bankRepository.deleteBank(bankId);
                    console.log("Deleting bank with ID:", bankId);

                    showDialog({
                        title: "Cuenta eliminada",
                        subtitle: "La cuenta bancaria ha sido eliminada correctamente",
                        nextText: "Entendido",
                        onNext: () => {
                            // Refrescar lista de cuentas bancarias

                        }
                    });
                } catch (error) {
                    console.error("Error deleting bank:", error);
                    showDialog({
                        title: "Error al eliminar",
                        subtitle: "No pudimos eliminar la cuenta. Intenta de nuevo.",
                        nextText: "Entendido"
                    });
                } finally {
                    setIsDeletingBank(false);
                }
            },
            nextText: "Eliminar",
            backText: "Cancelar"
        });
    }, [showDialog]);

    return {
        bankAccounts,
        isAccountOptionsLoading,
        isDeletingBank,
        selectedBankAccount,
        handleSelectBank,
        handleDeleteBank,
    };
};