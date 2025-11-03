import React, { useState, useRef, useEffect } from 'react';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { IoCloseCircleOutline } from 'react-icons/io5';
import TileApp from '../../../../shared/components/TileApp';

interface MemberTileProps {
    id: string;
    name: string;
    email: string;
    isAdmin?: boolean; // Para diferenciar si es admin o miembro
    onRemove?: (id: string) => void;
}

const MemberTile: React.FC<MemberTileProps> = ({
    id,
    name,
    email,
    isAdmin = false,
    onRemove
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

    const handleRemove = () => {
        if (onRemove) {
            onRemove(id);
        }
        setIsMenuOpen(false);
    };

    return (
        <div className="border border-[#666666] rounded-[10px] bg-white p-2.5 transition-all duration-200 ease-in-out hover:border-gray-400 hover:shadow-sm">
            <div className="flex items-center justify-between">
                {/* Contenido principal */}
                <div className="flex-1">
                    <TileApp
                        title={name}
                        subtitle={email}
                        titleClassName="text-base font-semibold text-[#020F1E]"
                        subtitleClassName="text-xs font-medium text-[#666666] truncate mt-0.5"
                        leading={
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-blue-600">
                                    {name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        }
                        trailing={
                            isAdmin && (
                                <div className="flex items-center">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        Admin
                                    </span>
                                </div>
                            )
                        }
                    />
                </div>

                {/* Menú de opciones (solo si no es admin o si hay permisos) */}
                {!isAdmin && (
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
                                {/* Opción remover */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove();
                                    }}
                                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                    <IoCloseCircleOutline className="w-4 h-4" />
                                    Remover miembro
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberTile;