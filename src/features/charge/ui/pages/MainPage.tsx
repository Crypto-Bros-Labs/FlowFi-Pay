import React from "react";
import { IoPerson } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { MdGroups } from "react-icons/md";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { IoCashOutline } from "react-icons/io5";
import { BiMoneyWithdraw } from "react-icons/bi";
import { PiHandDeposit } from "react-icons/pi";
import { LuQrCode } from "react-icons/lu";
import AppHeader from "../../../../shared/components/AppHeader";
import { useMain } from "../hooks/useMain";
import { useAppBar } from "../../../../shared/hooks/useAppBar";
import { useProfile } from "../../../profile/ui/hooks/useProfile";
import { useCurrency } from "../../../../shared/hooks/useCurrency";
import ActionButton from "../../../../shared/components/ActionButton";
import TileButton from "../../../../shared/components/TileButton";
import BalanceCard from "../components/BalanceCard";

const MainPage: React.FC = () => {
  const {
    goToSelectToken,
    isAccountOptionsLoading,
    onHandleSend,
    onHandleWithdraw,
    onHandleReceive,
    onHandleBuySell,
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
      <div className="px-4 mb-4">
        {/* ✅ CARD DE BALANCE */}
        <BalanceCard
          balance={
            currency === "USD"
              ? formatedBalance
              : formatedBalance * usdToMxnRate
          }
          currency={currency}
        />

        <div className="w-full flex justify-center gap-2">
          {/* Botón Enviar */}
          <ActionButton
            icon={<GoArrowUpRight className="w-5 h-5 text-blue-600" />}
            label="Enviar"
            onClick={onHandleSend}
          />

          {/* Botón Recibir */}
          <ActionButton
            icon={<GoArrowDownLeft className="w-5 h-5 text-blue-600" />}
            label="Recibir"
            onClick={onHandleReceive}
          />

          {/* Botón Depositar */}
          <ActionButton
            icon={<PiHandDeposit className="w-5 h-5 text-gray-400" />}
            label="Depositar"
            onClick={() => {}}
            disabled
          />

          {/* Botón Retirar */}
          <ActionButton
            icon={<IoCashOutline className="w-5 h-5 text-blue-600" />}
            label="Retirar"
            onClick={() => {
              if (kycStatus !== "APPROVED") {
                handleKycStatusInfo();
              } else {
                onHandleWithdraw();
              }
            }}
          />
        </div>
      </div>

      {/* ✅ SECCIÓN CENTRAL - Botón Cobrar y sección de Compra/Venta */}
      <div className="flex flex-col items-center px-4 flex-1 ">
        {/* Botón Cobrar */}
        <div className="w-full mb-2">
          <TileButton
            icon={<LuQrCode className="w-6 h-6 text-blue-600" />}
            title="Cobrar"
            subtitle="Genera un código QR para recibir pagos"
            onClick={goToSelectToken}
          />
        </div>

        {/* Sección de Compra y Venta */}
        <div className="w-full mb-2">
          {/* Botón Comprar */}
          <TileButton
            icon={
              <img
                src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                className="w-6 h-6 text-blue-600"
              />
            }
            title="Comprar/Vender USDC"
            subtitle="Hacia y desde cualquier billetera"
            onClick={() => {
              if (kycStatus !== "APPROVED") {
                handleKycStatusInfo();
              } else {
                onHandleBuySell();
              }
            }}
          />
        </div>
        {/* 
        <div className="w-full mb-2">
          <TileButton
            icon={<BiDollar className="w-6 h-6 text-blue-600" />}
            title="Comprar USDC"
            subtitle="Hacia y desde cualquier billetera"
            onClick={() => {
              if (kycStatus !== "APPROVED") {
                handleKycStatusInfo();
              } else {
                onHandleBuy();
              }
            }}
          />
        </div>
        <div className="w-full mb-2">
          <TileButton
            icon={<FaMoneyBillTransfer className="w-6 h-6 text-blue-600" />}
            title="Vender USDC"
            subtitle="Hacia y desde cualquier billetera"
            onClick={() => {
              if (kycStatus !== "APPROVED") {
                handleKycStatusInfo();
              } else {
                onHandleSell();
              }
            }}
          />
        </div>
        */}
      </div>
    </div>
  );
};

export default MainPage;
