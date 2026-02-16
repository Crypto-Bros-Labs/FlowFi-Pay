import React, { useMemo } from "react";
import { BiHistory } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { useParams } from "react-router-dom";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import AppHeader from "../../../../shared/components/AppHeader";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import AccountSelectionSection from "../components/AccountSelectionSection";
import { useSelectAccount } from "../hooks/useSelectAccount";

export interface SelectAccountPageProps {
  isOrigin?: boolean;
}

const SelectAccountPage: React.FC<SelectAccountPageProps> = ({
  isOrigin: isOriginProp,
}) => {
  const { goToHistory, goToProfile } = useAppBar();
  const params = useParams<{ type?: "origin" | "target" }>();

  // ✅ Obtener isOrigin desde parámetros o props
  const isOrigin = useMemo(
    () =>
      isOriginProp !== undefined ? isOriginProp : params.type === "origin",
    [isOriginProp, params.type],
  );

  const {
    title,
    description,
    selectedAccountId,
    selectedAccount,
    handleMexicanAccountSelect,
    handleUSAccountSelect,
    handleContinue,
    canContinue,
    showMexicanAccounts,
    showUSAccounts,
  } = useSelectAccount({ isOrigin });

  return (
    <div className="h-9/10 md:h-12/12 lg:h-12/12 flex flex-col p-4">
      <div className="flex flex-col h-full">
        {/* Header */}
        <AppHeader
          title={title}
          rightActions={[
            {
              icon: BiHistory,
              onClick: goToHistory,
              className: "text-gray-700",
            },
            {
              icon: IoPerson,
              onClick: goToProfile,
              className: "text-gray-700",
            },
          ]}
        />

        {/* Descripción */}
        <div className="px-4 mt-4">
          <DescriptionApp
            title={
              isOrigin
                ? "¿Desde qué cuenta deseas enviar?"
                : "¿A qué cuenta deseas enviar?"
            }
            description={description}
          />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Cuentas Mexicanas */}
          {showMexicanAccounts && (
            <AccountSelectionSection
              label="Cuentas Mexicanas (MXN)"
              onAccountSelect={handleMexicanAccountSelect}
              selectedAccountId={selectedAccountId}
              accountOriginType="MX"
            />
          )}

          {/* Mensaje cuando se ocultan cuentas mexicanas */}
          {!showMexicanAccounts && !isOrigin && (
            <div className="px-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600">
                ✓ Cuenta origen mexicana seleccionada - Mostrando solo cuentas
                estadounidenses
              </p>
            </div>
          )}

          {/* Cuentas Estadounidenses */}
          {showUSAccounts && (
            <AccountSelectionSection
              label="Cuentas Estadounidenses (USD)"
              onAccountSelect={handleUSAccountSelect}
              selectedAccountId={selectedAccountId}
              accountOriginType="US"
            />
          )}

          {/* Mensaje cuando se ocultan cuentas estadounidenses */}
          {!showUSAccounts && !isOrigin && (
            <div className="px-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600">
                ✓ Cuenta origen estadounidense seleccionada - Mostrando solo
                cuentas mexicanas
              </p>
            </div>
          )}

          {/* Mostrar cuenta seleccionada */}
          {selectedAccount && (
            <div className="px-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-600 mb-1">
                {isOrigin
                  ? "Cuenta origen seleccionada:"
                  : "Cuenta destino seleccionada:"}
              </p>
              <p className="text-sm font-medium text-green-700">
                Cuenta: {`**** ${String(selectedAccount).slice(-4)}`}
              </p>
            </div>
          )}
        </div>

        {/* Fixed Bottom Button */}
        <div className="flex-shrink-0 px-2 pt-4 border-t border-gray-200">
          <ButtonApp
            text="Continuar"
            paddingVertical="py-3"
            textSize="text-sm"
            isMobile={true}
            onClick={handleContinue}
            disabled={!canContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectAccountPage;
