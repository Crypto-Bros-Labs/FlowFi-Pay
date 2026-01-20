import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBankOptions,
  createWalletOptions,
} from "../utils/AccountComponents";
import type { ComboBoxOption } from "../components/ComboBoxApp";
import userRepository from "../../features/login/data/repositories/userRepository";
import { useAppData } from "./useAppData";

export const useAccountOptions = () => {
  const navigate = useNavigate();
  const { walletAddresses, bankAccounts, isLoadingAccounts } = useAppData();

  const [selectedWalletAddress, setSelectedWalletAddress] =
    useState<string>("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");

  const handleAddWallet = () => {
    navigate("/add-wallet");
  };

  const walletComboBoxOptions = createWalletOptions(
    walletAddresses,
    handleAddWallet,
  );

  const handleWalletSelect = (option: ComboBoxOption) => {
    if (option.id === "add-wallet") return;
    setSelectedWalletAddress(option.id as string);
  };

  const handleAddBank = () => {
    navigate("/add-account");
  };

  const bankComboBoxOptions = createBankOptions(bankAccounts, handleAddBank);

  const handleBankSelect = (option: ComboBoxOption) => {
    if (option.id === "add-bank") return;
    setSelectedBankAccount(option.id as string);
    userRepository.setBankAccountUuid(option.id as string);
  };

  // Inicializar selecciones
  useEffect(() => {
    if (walletAddresses.length > 0 && !selectedWalletAddress) {
      setSelectedWalletAddress(walletAddresses[0].id);
    }
  }, [walletAddresses, selectedWalletAddress]);

  useEffect(() => {
    if (bankAccounts.length > 0 && !selectedBankAccount) {
      const initializeBankAccount = async () => {
        const userBankUuid = await userRepository.getBankAccountUuid();
        if (
          userBankUuid &&
          bankAccounts.some((acc) => acc.id === userBankUuid)
        ) {
          setSelectedBankAccount(userBankUuid);
        } else {
          setSelectedBankAccount(bankAccounts[0].id);
          userRepository.setBankAccountUuid(bankAccounts[0].id);
        }
      };
      initializeBankAccount();
    }
  }, [bankAccounts, selectedBankAccount]);

  return {
    isAccountOptionsLoading: isLoadingAccounts,
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
  };
};
