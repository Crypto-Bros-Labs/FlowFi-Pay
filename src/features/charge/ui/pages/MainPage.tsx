import React from "react";
import { IoPerson } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { IoCashOutline } from "react-icons/io5";
import { BiMoneyWithdraw, BiDollar } from "react-icons/bi";
import { PiHandDeposit } from "react-icons/pi";
import AppHeader from "../../../../shared/components/AppHeader";
import { useMain } from "../hooks/useMain";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import { useProfile } from "../../../profile/ui/hooks/useProfile";
import { useCurrency } from "../../../../shared/hooks/useCurrency";

const MainPage: React.FC = () => {
  const {
    goToSelectToken,
    isAccountOptionsLoading,
    onHandleSend,
    onHandleBuy,
    onHandleWithdraw,
    onHandleReceive,
    onHandleSell,
    isLoading,
  } = useMain();

  const {
    formatedBalance,
    isLoadingUserData,
    role,
    kycStatus,
    handleKycStatusInfo,
  } = useProfile();

  const { currency, usdToMxnRate } = useCurrency();

  const { goToHistory, goToProfile, goToTeam } = useAppBar();

  // ✅ Determinar si es cashier
  const isCashier = role?.toUpperCase() === "CASHIER";
  // ✅ Determinar si es admin
  const isAdmin = role?.toUpperCase() === "USER";

  if (isAccountOptionsLoading || isLoading || isLoadingUserData) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-500">Cargando...</span>
      </div>
    );
  }

  // ✅ Vista para CASHIER - Solo botón de cobrar
  if (isCashier) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-2">
          <AppHeader
            title="Billetera"
            leftActions={[
              {
                icon: BiHistory,
                onClick: goToHistory,
                className: "text-gray-700",
              },
            ]}
            rightActions={[
              {
                icon: IoPerson,
                onClick: goToProfile,
                className: "text-gray-700",
              },
            ]}
          />
        </div>

        {/* ✅ SECCIÓN CENTRAL - Botón Cobrar centrado */}
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <button
            className="
                            w-50 h-50 
                            bg-white 
                            rounded-full 
                            shadow-lg 
                            hover:shadow-xl 
                            active:shadow-md
                            transition-all duration-200 ease-in-out
                            flex flex-col items-center justify-center gap-2
                            hover:scale-105
                            active:scale-95
                            border-0 outline-none
                            focus:ring-4 focus:ring-blue-100
                        "
            onClick={goToSelectToken}
          >
            <BiMoneyWithdraw className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Cobrar</span>
          </button>
        </div>
      </div>
    );
  }

  // ✅ Vista para EMPLOYEE y ADMIN - Layout completo sin team
  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <AppHeader
          title="Billetera"
          leftActions={[
            {
              icon: BiHistory,
              onClick: goToHistory,
              className: "text-gray-700",
            },
            // ✅ Solo mostrar Team para ADMIN
            ...(isAdmin
              ? [
                  {
                    icon: MdGroups,
                    onClick: goToTeam,
                    className: "text-gray-700",
                  },
                ]
              : []),
          ]}
          rightActions={[
            {
              icon: IoPerson,
              onClick: goToProfile,
              className: "text-gray-700",
            },
          ]}
        />
      </div>

      {/* ✅ SECCIÓN SUPERIOR - Balance y botones */}
      <div className="px-4 py-6 space-y-3">
        {/* ✅ SECCIÓN DE BALANCE */}
        <div className="w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500 mb-2">
              Balance disponible
            </p>
            <div className="flex items-start justify-center gap-1">
              <span className="text-5xl font-bold text-gray-900">
                $
                {currency === "USD"
                  ? formatedBalance.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : (formatedBalance * usdToMxnRate).toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-400 mt-2">{currency}</p>
          </div>
        </div>

        {/* ✅ SECCIÓN DE BOTONES CIRCULARES */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
            {/* Botón Enviar */}
            <button
              className="
                                flex flex-col items-center justify-center gap-2
                                w-20 h-20
                                bg-white 
                                rounded-full 
                                shadow-md 
                                hover:shadow-lg 
                                active:shadow-sm
                                transition-all duration-200 ease-in-out
                                hover:scale-105
                                active:scale-95
                                border-0 outline-none
                                focus:ring-4 focus:ring-blue-100
                            "
              onClick={onHandleSend}
            >
              <GoArrowUpRight className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 text-center">
                Enviar
              </span>
            </button>

            {/* Botón Recibir */}
            <button
              className="
                                flex flex-col items-center justify-center gap-2
                                w-20 h-20
                                bg-white 
                                rounded-full 
                                shadow-md 
                                hover:shadow-lg 
                                active:shadow-sm
                                transition-all duration-200 ease-in-out
                                hover:scale-105
                                active:scale-95
                                border-0 outline-none
                                focus:ring-4 focus:ring-blue-100
                            "
              onClick={onHandleReceive}
            >
              <GoArrowDownLeft className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 text-center">
                Recibir
              </span>
            </button>

            {/* Botón Comprar */}
            <button
              className="
                          flex flex-col items-center justify-center gap-2
                          w-20 h-20
                          bg-white 
                          rounded-full 
                          shadow-md 
                          transition-all duration-200 ease-in-out
                          border-0 outline-none
                          opacity-50 cursor-not-allowed
                        "
              onClick={() => {}}
              disabled
            >
              <PiHandDeposit className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 text-center">
                Depositar
              </span>
            </button>

            {/* Botón Retirar */}
            <button
              className="
                                flex flex-col items-center justify-center gap-2
                                w-20 h-20
                                bg-white 
                                rounded-full 
                                shadow-md 
                                hover:shadow-lg 
                                active:shadow-sm
                                transition-all duration-200 ease-in-out
                                hover:scale-105
                                active:scale-95
                                border-0 outline-none
                                focus:ring-4 focus:ring-blue-100
                            "
              onClick={() => {
                if (kycStatus !== "APPROVED") {
                  handleKycStatusInfo();
                } else {
                  onHandleWithdraw();
                }
              }}
            >
              <IoCashOutline className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 text-center">
                Retirar
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ✅ SECCIÓN CENTRAL - Botón Cobrar y sección de Compra/Venta */}
      <div className="flex flex-col items-center justify-center px-4 flex-1 space-y-6">
        {/* Botón Cobrar */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-gray-500 text-center pb-5">
            Recibe pagos al instante
          </p>
          <button
            className="
                          w-50 h-50 
                          bg-white
                          rounded-full 
                          shadow-lg 
                          hover:shadow-xl 
                          active:shadow-md
                          transition-all duration-200 ease-in-out
                          flex flex-col items-center justify-center gap-2
                          hover:scale-105
                          active:scale-95
                          border-0 outline-none
                          focus:ring-4 focus:ring-blue-100
                      "
            onClick={goToSelectToken}
          >
            <BiMoneyWithdraw className="w-8 h-8 text-blue-600" />
            <span className="text-sm ">Cobrar</span>
          </button>
        </div>

        {/* Divisor visual */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-blue-300"></div>
          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          <div className="w-1 h-1 rounded-full bg-blue-500"></div>
          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          <div className="w-1 h-1 rounded-full bg-blue-300"></div>
        </div>

        {/* Sección de Compra y Venta */}
        <div className="w-full max-w-sm">
          {/* Título y Subtítulo */}
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Compra y vende USDC
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Hacia y desde cualquier billetera
            </p>
          </div>

          {/* Botones Comprar y Vender */}
          <div className="flex gap-6 justify-center">
            {/* Botón Comprar */}
            <button
              className="
                flex flex-col items-center justify-center gap-2
                w-24 h-24
                bg-white 
                rounded-full 
                shadow-md 
                hover:shadow-lg 
                active:shadow-sm
                transition-all duration-200 ease-in-out
                hover:scale-105
                active:scale-95
                border-0 outline-none
                focus:ring-4 focus:ring-blue-100
              "
              onClick={() => {
                if (kycStatus !== "APPROVED") {
                  handleKycStatusInfo();
                } else {
                  onHandleBuy();
                }
              }}
            >
              <BiDollar className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 text-center">
                Comprar
              </span>
            </button>

            {/* Botón Vender */}
            <button
              className="
                flex flex-col items-center justify-center gap-2
                w-24 h-24
                bg-white 
                rounded-full 
                shadow-md 
                hover:shadow-lg 
                active:shadow-sm
                transition-all duration-200 ease-in-out
                hover:scale-105
                active:scale-95
                border-0 outline-none
                focus:ring-4 focus:ring-blue-100
              "
              onClick={() => {
                if (kycStatus !== "APPROVED") {
                  handleKycStatusInfo();
                } else {
                  onHandleSell();
                }
              }}
            >
              <IoCashOutline className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 text-center">
                Vender
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
