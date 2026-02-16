import React from "react";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import ComboBoxApp, {
  type ComboBoxOption,
} from "../../../../shared/components/ComboBoxApp";

interface AccountSelectionSectionProps {
  label: string;
  onAccountSelect?: (accountId: string | number, accountName?: string) => void;
  selectedAccountId?: string | number;
  accountOriginType?: "MX" | "US";
}

const AccountSelectionSection: React.FC<AccountSelectionSectionProps> = ({
  label,
  onAccountSelect,
  selectedAccountId,
  accountOriginType,
}) => {
  const {
    bankAccounts,
    bankComboBoxOptions,
    handleAddBank,
    usaBankAccounts,
    usaBankComboBoxOptions,
  } = useAccountOptions();

  const handleSelect = (option: ComboBoxOption) => {
    if (onAccountSelect) {
      onAccountSelect(option.id, option.account);
    }
  };

  return (
    <div className="mb-6 px-2">
      <div className="text-sm font-bold text-[#020F1E] truncate mb-2">
        {label}
      </div>
      {accountOriginType === "MX" ? (
        bankAccounts && bankAccounts.length > 0 ? (
          <ComboBoxApp
            options={bankComboBoxOptions}
            selectedId={selectedAccountId}
            onSelect={handleSelect}
          />
        ) : (
          <button
            type="button"
            onClick={handleAddBank}
            className={`
                        w-full p-2.5 flex items-center justify-center gap-3
                        border border-[#666666] rounded-[10px]
                        bg-white text-left
                        transition-all duration-200 ease-in-out
                        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        cursor-pointer
                    `}
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
            <span className="text-sm font-bold text-[#020F1E] mt-0.75">
              Agregar cuenta de banco
            </span>
          </button>
        )
      ) : usaBankAccounts && usaBankAccounts.length > 0 ? (
        <ComboBoxApp
          options={usaBankComboBoxOptions}
          selectedId={selectedAccountId}
          onSelect={handleSelect}
        />
      ) : (
        <button
          type="button"
          onClick={handleAddBank}
          className={`
                        w-full p-2.5 flex items-center justify-center gap-3
                        border border-[#666666] rounded-[10px]
                        bg-white text-left
                        transition-all duration-200 ease-in-out
                        hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                        cursor-pointer
                    `}
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
          <span className="text-sm font-bold text-[#020F1E] mt-0.75">
            Agregar cuenta de banco
          </span>
        </button>
      )}
    </div>
  );
};

export default AccountSelectionSection;
