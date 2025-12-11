import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBankOptions, createWalletOptions } from "../utils/AccountComponents";
import type { ComboBoxOption } from "../components/ComboBoxApp";
import bankRepository from "../../features/profile/data/repositories/bankRepository";
import savedWalletsRepository from "../../features/profile/data/repositories/savedWalletsRepository";
import userRepository from "../../features/login/data/repositories/userRepository";

interface WalletAddress {
    id: string;
    name: string;
    address: string;
    network: string;
}

interface BankAccount {
    id: string;
    bankName: string;
    accountNumber: string;
}



export const useAccountOptions = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // wallet adress
    const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
    const [selectedWalletAddress, setSelectedWalletAddress] = useState<string>('');

    const fetchWalletAddresses = async () => {
        setIsLoading(true);

        const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';

        const wallets = await savedWalletsRepository.getSavedWallets(userUuid);
        const formattedWallets = wallets.map((wallet, index) => ({
            id: index.toString(),
            name: wallet.alias,
            address: wallet.walletAddress,
            network: wallet.network,
        }));

        setWalletAddresses(formattedWallets);

        if (formattedWallets.length > 0) {
            setSelectedWalletAddress(formattedWallets[0].id);
        }
        setIsLoading(false);
    };

    const handleAddWallet = () => {
        navigate('/add-wallet');
    };

    // Convertir wallet addresses a ComboBoxOptions
    const walletComboBoxOptions = createWalletOptions(
        walletAddresses,
        handleAddWallet
    );

    const handleWalletSelect = (option: ComboBoxOption) => {
        if (option.id === 'add-wallet') {
            console.log('Acción: Agregar nueva wallet');
            return;
        }
        setSelectedWalletAddress(option.id as string);

    };

    // bank account
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<string>('');

    const fetchBankAccounts = async () => {
        setIsLoading(true);
        try {
            const userUuid = (await userRepository.getCurrentUserData())?.userUuid || 'default-uuid';
            const response = await bankRepository.getBankAccounts(userUuid);

            if (!response.success) {
                console.error('Error fetching bank accounts:', response.error);
                return;
            }

            if (response.success && response.data) {
                const bankAccountsData = response.data.map((account) => ({
                    id: account.userBankInformationUuid,
                    bankName: account.bankName,
                    accountNumber: account.clabe
                }));
                setBankAccounts(bankAccountsData);

                if (bankAccountsData.length > 0) {
                    const userBankAccountUuid = await userRepository.getBankAccountUuid();
                    if (userBankAccountUuid && bankAccountsData.some(acc => acc.id === userBankAccountUuid)) {
                        setSelectedBankAccount(userBankAccountUuid);
                    } else {
                        setSelectedBankAccount(bankAccountsData[0].id);
                        userRepository.setBankAccountUuid(bankAccountsData[0].id);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBank = () => {
        navigate('/add-account');
        // O abrir modal: setShowAddBankModal(true);
    };

    // Convertir bank accounts a ComboBoxOptions
    const bankComboBoxOptions = createBankOptions(
        bankAccounts,
        handleAddBank)

    const handleBankSelect = (option: ComboBoxOption) => {
        if (option.id === 'add-bank') {
            console.log('Acción: Agregar nuevo banco');
            return;
        }
        setSelectedBankAccount(option.id as string);
        userRepository.setBankAccountUuid(option.id as string);
    };

    useEffect(() => {

        fetchWalletAddresses();
        fetchBankAccounts();

    }, []);

    return {
        isAccountOptionsLoading: isLoading,
        walletAddresses,
        walletComboBoxOptions,
        selectedWalletAddress,
        onWalletSelect: handleWalletSelect,
        bankAccounts,
        bankComboBoxOptions,
        selectedBankAccount,
        onBankSelect: handleBankSelect,
        handleAddBank,
        handleAddWallet,

    }
}