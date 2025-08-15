import React from "react";
import { IoPerson } from "react-icons/io5";
import { BiHistory } from "react-icons/bi";
import { BiMoneyWithdraw } from "react-icons/bi";
import AppHeader from "../../../../shared/components/AppHeader";
import { useMain } from "../hooks/useMain";
import { useAppBar } from "../../../../shared/hooks/useAppBar";

const MainPage: React.FC = () => {
    const { goToSelectToken, isAccountOptionsLoading } = useMain();
    const { goToHistory, goToProfile } = useAppBar();

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

            <div className="flex-1 flex flex-col items-center justify-center px-4">

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