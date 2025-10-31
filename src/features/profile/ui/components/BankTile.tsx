import React, { useState, useRef, useEffect } from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { IoCloseCircleOutline } from 'react-icons/io5';
import TileApp from '../../../../shared/components/TileApp';

interface BankTileProps {
    id: string;
    bankName: string;
    accountNumber: string;
    isModificable?: boolean;
    onClick?: () => void;
    onDelete?: (id: string) => void;
}

const BankTile: React.FC<BankTileProps> = ({
    id,
    bankName,
    accountNumber,
    isModificable = false,
    onClick,
    onDelete
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // ✅ Cerrar menú al hacer click fuera
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

    return (
        <div
            onClick={onClick}
            className="border border-[#666666] rounded-[10px] bg-white p-2.5 transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-sm cursor-pointer"
        >
            <div className="flex items-center justify-between">
                {/* Contenido principal */}
                <div className="flex-1">
                    <TileApp
                        title="Banco"
                        subtitle={bankName}
                        subtitleClassName="text-xs font-medium text-[#666666] truncate mt-0.5 max-w-[110px]"
                        leading={
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        }
                        trailing={
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-bold text-[#020F1E] truncate">
                                    No. de cuenta
                                </span>
                                <span className="text-xs font-medium text-[#666666] truncate">
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
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Más opciones"
                        >
                            <HiEllipsisVertical className="w-5 h-5 text-gray-600" />
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
                    <BiChevronRight className="w-6 h-6 text-gray-400 ml-2 flex-shrink-0" />
                )}
            </div>
        </div>
    );
};

export default BankTile;