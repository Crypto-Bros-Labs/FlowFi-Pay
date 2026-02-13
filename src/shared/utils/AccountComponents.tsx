import type { UsaBankAccountResponse } from "../../features/profile/data/models/bankModel";
import type { ComboBoxOption } from "../components/ComboBoxApp";
import TileApp from "../components/TileApp";
import { formatCryptoAddress } from "./cryptoUtils";

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

// Crear opciones para wallets
export const createWalletOptions = (
  wallets: WalletAddress[],
  onAddWallet?: () => void,
): ComboBoxOption[] => [
  ...wallets.map((wallet) => ({
    id: wallet.id,
    component: (
      <TileApp
        title={wallet.name || "Wallet"}
        subtitle={formatCryptoAddress(wallet.address, "medium")}
        leading={
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        }
        trailing={
          <span className="text-xs font-medium text-[#666666] truncate">
            {wallet.network}
          </span>
        }
      />
    ),
  })),
  ...(onAddWallet ? [createAddOption("Agregar wallet", onAddWallet)] : []),
];

// Crear opciones para bancos México
export const createBankOptions = (
  banks: BankAccount[],
  onAddBank?: () => void,
): ComboBoxOption[] => [
  ...banks.map((bank) => ({
    id: bank.id,
    component: (
      <TileApp
        title="Banco"
        subtitle={bank.bankName}
        subtitleClassName="text-xs font-medium text-[#666666] truncate mt-0.5 max-w-[110px]"
        leading={
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        }
        trailing={
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-[#020F1E] truncate">
              No. de cuenta
            </span>
            <span className="text-xs font-medium text-[#666666] truncate">
              **** {bank.accountNumber.slice(-4)}
            </span>
          </div>
        }
      />
    ),
  })),
  ...(onAddBank ? [createAddOption("Agregar cuenta bancaria", onAddBank)] : []),
];

// Crear opciones para bancos USA
export const createUSABankOptions = (
  banks: UsaBankAccountResponse[],
  onAddBank?: () => void,
): ComboBoxOption[] => [
  ...banks.map((bank) => {
    const holderName = bank.bankName;
    //  bank.accountHolder.type === "BUSINESS"
    //    ? bank.accountHolder.businessName
    //        : `${bank.accountHolder.firstName} ${bank.accountHolder.lastName}`;

    return {
      id: bank.USBankInformationUuid,
      component: (
        <TileApp
          title="Banco USA"
          subtitle={holderName}
          subtitleClassName="text-xs font-medium text-[#666666] truncate mt-0.5 max-w-[150px]"
          leading={
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          }
          trailing={
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-[#020F1E] truncate">
                Routing: {bank.routingNumber}
              </span>
              <span className="text-xs font-medium text-[#666666] truncate">
                **** {bank.accountIdentifier.slice(-4)}
              </span>
            </div>
          }
        />
      ),
    };
  }),
  ...(onAddBank ? [createAddOption("Agregar cuenta USA", onAddBank)] : []),
];

// Componente genérico para opciones de "agregar"
const createAddOption = (
  text: string,
  onClick: () => void,
): ComboBoxOption => ({
  id: `add-${text.toLowerCase().replace(/\s+/g, "-")}`,
  component: (
    <div
      onClick={onClick}
      className="w-full p-1 flex items-center gap-3 bg-white text-left justify-center transition-all duration-150 ease-in-out hover:bg-gray-50 cursor-pointer rounded-none"
    >
      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </div>
      <span className="text-sm font-bold text-[#020F1E] mt-0.75">{text}</span>
    </div>
  ),
});

export type { WalletAddress, BankAccount };
