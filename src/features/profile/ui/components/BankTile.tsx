import React, { useState, useRef, useEffect } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { IoCheckmarkCircle } from 'react-icons/io5';
import TileApp from '../../../../shared/components/TileApp';

interface BankTileProps {
    id: string;
    bankName: string;
    accountNumber: string;
    isModificable?: boolean;
    isSelected?: boolean; // ✅ Nuevo parámetro
    onClick?: () => void;
    onDelete?: (id: string) => void;
}

const BankTile: React.FC<BankTileProps> = ({
    id,
    bankName,
    accountNumber,
    isModificable = false,
    isSelected = false,
    onClick,
    onDelete
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleDelete = () => {
        if (onDelete) {
            onDelete(id);
        }
        setIsMenuOpen(false);
    };

    const containerClasses = isSelected
        ? "border-2 border-blue-600 rounded-[10px] bg-blue-600 p-2.5 transition-all duration-200 ease-in-out hover:shadow-sm cursor-pointer"
        : "border border-[#666666] rounded-[10px] bg-white p-2.5 transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-sm cursor-pointer";

    return (
        <div
            onClick={onClick}
            className={containerClasses}
        >
            <div className="flex items-center justify-between">
                {/* Contenido principal */}
                <div className="flex-1">
                    <TileApp
                        title="Banco"
                        subtitle={bankName}
                        titleClassName={isSelected ? "text-white" : "text-[#020F1E]"}
                        subtitleClassName={`text-xs font-medium truncate mt-0.5 max-w-[110px] ${isSelected ? "text-blue-100" : "text-[#666666]"
                            }`}
                        leading={
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? "bg-blue-500" : "bg-blue-100"
                                }`}>
                                {isSelected ? (
                                    <IoCheckmarkCircle className="w-6 h-6 text-white animate-pulse" />
                                ) : (
                                    <svg className={`w-6 h-6 ${isSelected ? "text-white" : "text-blue-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                )}
                            </div>
                        }
                        trailing={
                            <div className="flex flex-col gap-0.5">
                                <span className={`text-sm font-bold truncate ${isSelected ? "text-white" : "text-[#020F1E]"
                                    }`}>
                                    No. de cuenta
                                </span>
                                <span className={`text-xs font-medium truncate ${isSelected ? "text-blue-100" : "text-[#666666]"
                                    }`}>
                                    **** {accountNumber.slice(-4)}
                                </span>
                            </div>
                        }
                    />
                </div>

                {/* Icono derecha - Chevron o Menu */}
                {isModificable ? (
                    <div className="relative ml-2" ref={menuRef}>
                        {/* Botón de opciones */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            className={`p-1 rounded-full transition-colors ${isSelected
                                ? "hover:bg-blue-500"
                                : "hover:bg-gray-100"
                                }`}
                            aria-label="Más opciones"
                        >
                            <HiEllipsisVertical className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-600"
                                }`} />
                        </button>

                        {/* ✅ Menú desplegable */}
                        {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[180px] overflow-hidden">
                                {/* Opción eliminar */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete();
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <IoCloseCircleOutline className="w-4 h-4" />
                                    Eliminar cuenta
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <BiChevronRight className={`w-6 h-6 ml-2 flex-shrink-0 ${isSelected ? "text-blue-200" : "text-gray-400"
                        }`} />
                )}
            </div>
        </div>
    );
};

export default BankTile;