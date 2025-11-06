import React from "react";
import { IoPerson } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { GoArrowDownLeft, GoArrowUpRight } from "react-icons/go";
import { IoCashOutline } from "react-icons/io5";
import { BiMoneyWithdraw, BiDollar } from "react-icons/bi";
import AppHeader from "../../../../shared/components/AppHeader";
import { useMain } from "../hooks/useMain";
import { useAppBar } from "../../../../shared/hooks/useAppBar";

const MainPage: React.FC = () => {
    const { goToSelectToken, isAccountOptionsLoading } = useMain();
    const { goToHistory, goToProfile } = useAppBar();

    // ✅ Mock de balance - cambiar por datos reales del hook
    const userBalance = 15750.50;

    if (isAccountOptionsLoading) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-2">
                <AppHeader
                    title="Cobrar"
                    leftAction={
                        {
                            icon: BiHistory,
                            onClick: goToHistory,
                            className: 'text-gray-700'
                        }
                    }
                    rightActions={[
                        {
                            icon: IoPerson,
                            onClick: goToProfile,
                            className: 'text-gray-700'
                        }
                    ]}
                />
            </div>

            {/* ✅ SECCIÓN SUPERIOR - Balance y botones */}
            <div className="px-4 py-6 space-y-6">
                {/* ✅ SECCIÓN DE BALANCE */}
                <div className="w-full">
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-500 mb-2">
                            Balance disponible
                        </p>
                        <div className="flex items-start justify-center gap-1">
                            <span className="text-5xl font-bold text-gray-900">
                                ${userBalance.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-gray-400 mt-2">
                            MXN
                        </p>
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
                            onClick={() => console.log('Enviar')}
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
                            onClick={() => console.log('Recibir')}
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
                                hover:shadow-lg 
                                active:shadow-sm
                                transition-all duration-200 ease-in-out
                                hover:scale-105
                                active:scale-95
                                border-0 outline-none
                                focus:ring-4 focus:ring-blue-100
                            "
                            onClick={() => console.log('Comprar')}
                        >
                            <BiDollar className="w-6 h-6 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700 text-center">
                                Comprar
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
                            onClick={() => console.log('Retirar')}
                        >
                            <IoCashOutline className="w-6 h-6 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700 text-center">
                                Retirar
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ SECCIÓN CENTRAL - Botón Cobrar centrado */}
            <div className="flex flex-col items-center justify-center px-4 mt-20">
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
                    <BiMoneyWithdraw className="w-8 h-8 text-gray-700" />

                    <span className="text-sm font-medium text-gray-700">
                        Cobrar
                    </span>
                </button>
            </div>
        </div>
    );
};

export default MainPage;