import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface BalanceCardProps {
  balance: number;
  currency: string;
  kycStatus?: string;
  kycStatusInfo?: Record<
    string,
    { label: string; bgColor: string; textColor: string }
  >;
  onKycStatusClick?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({
  balance,
  currency,
  kycStatus = "UNKNOWN",
  kycStatusInfo = {},
  onKycStatusClick,
}) => {
  const [isPrivate, setIsPrivate] = useState(false);

  const formattedBalance = balance.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const displayBalance = isPrivate
    ? formattedBalance
        .split("")
        .map((char) => (char === "," || char === "." ? char : "•"))
        .join("")
    : formattedBalance;

  const currentKycInfo = kycStatusInfo[kycStatus] || {
    label: "Desconocido",
    bgColor: "bg-gray-200",
    textColor: "text-gray-700",
  };

  return (
    <div className="w-full py-3">
      <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg p-6 space-y-6">
        {/* ✅ PRIMERA FILA - Título y Botón Privacy */}
        <div className="flex items-start justify-between">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-white/90">
              Balance disponible
            </p>

            {/* Chip de Currency */}
            <div className="inline-flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Botón Privacy */}
          <div className="flex items-start justify-start">
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="
                flex items-center justify-center
                px-1.5 py-1.5
                bg-white/20 backdrop-blur-sm
                rounded-full
                transition-all duration-200 ease-in-out
                hover:bg-white/30
                active:scale-95
                border-0 outline-none
                focus:ring-4 focus:ring-blue-300
              "
              aria-label={isPrivate ? "Mostrar balance" : "Ocultar balance"}
            >
              {isPrivate ? (
                <IoEyeOffOutline className="w-5 h-5 text-white" />
              ) : (
                <IoEyeOutline className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* ✅ SEGUNDA FILA - Balance y KYC Status */}
        <div className="flex items-end justify-between gap-4">
          {/* Balance */}
          <div className="flex items-start justify-center">
            <span className="text-5xl font-bold text-white tracking-tight">
              $ {displayBalance}
            </span>
          </div>

          {/* KYC Status */}
          <div className="flex">
            <span
              onClick={onKycStatusClick}
              className="
                px-3 py-1.5 rounded-full text-xs font-semibold
                bg-white/20
                backdrop-blur-sm
                text-white
                cursor-pointer
                transition-all duration-200
                hover:bg-white/30
                active:scale-95
              "
            >
              {currentKycInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
