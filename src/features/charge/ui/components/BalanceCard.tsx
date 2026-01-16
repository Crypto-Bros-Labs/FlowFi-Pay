import React, { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, currency }) => {
  const [isPrivate, setIsPrivate] = useState(false);

  const formattedBalance = balance.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Crear puntos con la misma longitud que el balance formateado
  const displayBalance = isPrivate
    ? formattedBalance
        .split("")
        .map((char) => (char === "," || char === "." ? char : "•"))
        .join("")
    : formattedBalance;

  return (
    <div className="w-full py-3">
      <div className="w-full bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-lg p-6 space-y-6">
        {/* ✅ PRIMERA FILA - Título y Botón Privacy */}
        <div className="flex items-center justify-between">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-white/90">
              Balance disponible
            </p>

            {/* Chip de Currency */}
            <div className="inline-flex items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Botón Privacy */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="
                flex items-center justify-center
                w-12 h-12
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
                <IoEyeOffOutline className="w-6 h-6 text-white" />
              ) : (
                <IoEyeOutline className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* ✅ SEGUNDA FILA - Balance */}
        <div className="flex items-center">
          <div className="flex items-start justify-center gap-1">
            <span className="text-5xl font-bold text-white tracking-tight">
              $ {displayBalance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
