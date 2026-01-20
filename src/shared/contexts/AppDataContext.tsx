import React, { createContext, useCallback, useState, useEffect } from "react";
import type { Token } from "../../features/charge/data/local/tokenLocalService";
import tokenRepository from "../../features/charge/data/repositories/tokenRepository";
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

interface UserData {
  fullName: string;
  role: string;
  image: string | null;
  walletAddress: string;
  formatedBalance: number;
  balance: number;
  kycStatus: string;
  kycUrl: string;
}

interface AppDataContextType {
  // Tokens
  tokens: Token[];
  isLoadingTokens: boolean;
  refetchTokens: () => Promise<void>;

  // Account Options (Wallets + Banks)
  walletAddresses: WalletAddress[];
  bankAccounts: BankAccount[];
  isLoadingAccounts: boolean;
  refetchAccounts: () => Promise<void>;

  // User Data
  userData: UserData | null;
  isLoadingUserData: boolean;
  refetchUserData: () => Promise<void>;

  // Profile Image
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  isUploadingImage: boolean;
  setIsUploadingImage: (value: boolean) => void;

  // Profile Name
  fullName: string;
  setFullName: (name: string) => void;
  isEditingName: boolean;
  setIsEditingName: (value: boolean) => void;
  tempName: string;
  setTempName: (name: string) => void;

  // Global loading (para POST requests)
  isPerformingAction: boolean;
  setIsPerformingAction: (value: boolean) => void;

  // Refrescar todo
  refetchAll: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);

  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

  // Profile Image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Profile Name
  const [fullName, setFullName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");

  const [isPerformingAction, setIsPerformingAction] = useState(false);

  const [hasInitialized, setHasInitialized] = useState(false);

  // Fetch Tokens
  const fetchTokens = useCallback(async () => {
    setIsLoadingTokens(true);
    try {
      await tokenRepository.fetchTokens();
      const fetchedTokens = tokenRepository.getTokens();
      setTokens(fetchedTokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setIsLoadingTokens(false);
    }
  }, []);

  // Fetch Account Options
  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    try {
      const userUuid =
        (await userRepository.getCurrentUserData())?.userUuid || "default-uuid";

      // Fetch Wallets
      const wallets = await savedWalletsRepository.getSavedWallets(userUuid);
      const formattedWallets = wallets.map((wallet, index) => ({
        id: index.toString(),
        name: wallet.alias,
        address: wallet.walletAddress,
        network: wallet.network,
      }));
      setWalletAddresses(formattedWallets);

      // Fetch Banks
      const bankResponse = await bankRepository.getBankAccounts(userUuid);
      if (bankResponse.success && bankResponse.data) {
        const bankAccountsData = bankResponse.data.map((account) => ({
          id: account.userBankInformationUuid,
          bankName: account.bankName,
          accountNumber: account.clabe,
        }));
        setBankAccounts(bankAccountsData);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setIsLoadingUserData(true);
    try {
      const userUuid =
        (await userRepository.getCurrentUserData())?.userUuid || "default-uuid";
      const userData = await userRepository.fetchUserData(userUuid);

      if (userData.success) {
        const kycData = await userRepository.getKycStatus(userUuid);

        const newUserData = {
          fullName: userData.data.fullName || "",
          role: userData.data.role || "",
          image: userData.data.image || null,
          walletAddress: userData.data.normalizedPublicKey || "",
          formatedBalance: parseFloat(userData.data.formatBalance) || 0.0,
          balance: parseFloat(userData.data.balance) || 0.0,
          kycStatus: kycData.status || "",
          kycUrl: kycData.kycUrl || "",
        };

        setUserData(newUserData);
        setFullName(newUserData.fullName);
        setProfileImage(newUserData.image);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingUserData(false);
    }
  }, []);

  // Inicializar datos al montar el provider
  useEffect(() => {
    if (!hasInitialized) {
      const initializeData = async () => {
        await Promise.all([fetchTokens(), fetchAccounts(), fetchUserData()]);
        setHasInitialized(true);
      };
      initializeData();
    }
  }, [hasInitialized, fetchTokens, fetchAccounts, fetchUserData]);

  // Refrescar todo
  const refetchAll = useCallback(async () => {
    await Promise.all([fetchTokens(), fetchAccounts(), fetchUserData()]);
  }, [fetchTokens, fetchAccounts, fetchUserData]);

  const value: AppDataContextType = {
    tokens,
    isLoadingTokens,
    refetchTokens: fetchTokens,
    walletAddresses,
    bankAccounts,
    isLoadingAccounts,
    refetchAccounts: fetchAccounts,
    userData,
    isLoadingUserData,
    refetchUserData: fetchUserData,
    profileImage,
    setProfileImage,
    isUploadingImage,
    setIsUploadingImage,
    fullName,
    setFullName,
    isEditingName,
    setIsEditingName,
    tempName,
    setTempName,
    isPerformingAction,
    setIsPerformingAction,
    refetchAll,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
};

export default AppDataContext;
