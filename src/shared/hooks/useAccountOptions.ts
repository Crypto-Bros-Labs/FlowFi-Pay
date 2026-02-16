import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBankOptions,
  createWalletOptions,
  createUSABankOptions,
} from "../utils/AccountComponents";
import type { ComboBoxOption } from "../components/ComboBoxApp";
import userRepository from "../../features/login/data/repositories/userRepository";
import { useAppData } from "./useAppData";

export const useAccountOptions = () => {
  const navigate = useNavigate();
  const {
    walletAddresses,
    bankAccounts,
    usaBankAccounts,
    selectedUsaBankAccount,
    setSelectedUsaBankAccount,
    isLoadingAccounts,
  } = useAppData();

  const [selectedWalletAddress, setSelectedWalletAddress] =
    useState<string>("");
  const [selectedBankAccount, setSelectedBankAccount] = useState<string>("");

  // ========== WALLETS ==========
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

  // ========== MEXICO BANKS ==========
  const handleAddBank = () => {
    navigate("/add-account");
  };

  const bankComboBoxOptions = createBankOptions(bankAccounts, handleAddBank);

  const handleBankSelect = (option: ComboBoxOption) => {
    if (option.id === "add-banco-mexicano") return;
    setSelectedBankAccount(option.id as string);
    userRepository.setBankAccountUuid(option.id as string);
  };

  // ========== USA BANKS ==========
  const handleAddUsaBank = () => {
    navigate("/add-account");
  };

  const usaBankComboBoxOptions = createUSABankOptions(
    usaBankAccounts,
    handleAddUsaBank,
  );

  const handleUsaBankSelect = (option: ComboBoxOption) => {
    if (option.id === "add-cuenta-usa") return;
    const selectedAccount = usaBankAccounts.find(
      (acc) => acc.usBankInfoUuid === option.id,
    );
    if (selectedAccount) {
      setSelectedUsaBankAccount(selectedAccount);
    }
  };

  // ========== INICIALIZAR WALLETS ==========
  useEffect(() => {
    if (walletAddresses.length > 0 && !selectedWalletAddress) {
      setSelectedWalletAddress(walletAddresses[0].id);
    }
  }, [walletAddresses, selectedWalletAddress]);

  // ========== INICIALIZAR MEXICO BANKS ==========
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

  // ========== INICIALIZAR USA BANKS ==========
  useEffect(() => {
    if (usaBankAccounts.length > 0 && !selectedUsaBankAccount) {
      setSelectedUsaBankAccount(usaBankAccounts[0]);
    }
  }, [usaBankAccounts, selectedUsaBankAccount, setSelectedUsaBankAccount]);

  return {
    isAccountOptionsLoading: isLoadingAccounts,

    // Wallets
    walletAddresses,
    walletComboBoxOptions,
    selectedWalletAddress,
    onWalletSelect: handleWalletSelect,
    handleAddWallet,

    // Mexico Banks
    bankAccounts,
    bankComboBoxOptions,
    selectedBankAccount,
    onBankSelect: handleBankSelect,
    handleAddBank,

    // USA Banks
    usaBankAccounts,
    usaBankComboBoxOptions,
    selectedUsaBankAccount,
    onUsaBankSelect: handleUsaBankSelect,
    handleAddUsaBank,
  };
};
