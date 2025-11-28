import React, { type ReactNode, useState, useRef, useEffect } from 'react';
import { BiChevronRight } from 'react-icons/bi';

export interface MenuOption {
    id: string;
    label: string;
    icon: ReactNode;
}

interface TileAppMenuProps {
    title: string;
    subtitle?: string | ReactNode;
    leading?: ReactNode;
    trailing?: ReactNode;
    disabled?: boolean;
    className?: string;
    titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    titleClassName?: string;
    subtitleClassName?: string;
    // ✅ Props del menú
    menuOptions: MenuOption[];
    onMenuSelect: (selectedId: string, selectedLabel: string) => void;
    menuTriggerText?: string;
    selectedMenuId?: string | null;
}

const TileAppMenu: React.FC<TileAppMenuProps> = ({
    title,
    subtitle,
    leading,
    trailing,
    disabled = false,
    className = "",
    titleSize = "sm",
    subtitleSize = "xs",
    titleClassName = "",
    subtitleClassName = "",
    menuOptions,
    onMenuSelect,
    menuTriggerText = "Seleccionar",
    selectedMenuId = null,
}) => {
    // ✅ Estados del menú
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedMenuId);
    const menuRef = useRef<HTMLDivElement>(null);

    // Sincronizar selectedMenuId externo
    useEffect(() => {
        if (selectedMenuId !== undefined) {
            setInternalSelectedId(selectedMenuId);
        }
    }, [selectedMenuId]);

    const getSizeClass = (size: string) => {
        switch (size) {
            case 'xs': return 'text-xs';
            case 'sm': return 'text-sm';
            case 'base': return 'text-base';
            case 'lg': return 'text-lg';
            case 'xl': return 'text-xl';
            default: return 'text-xs';
        }
    };

    const baseClasses = `
        w-full flex items-center justify-between
        transition-colors duration-150 ease-in-out py-2
        ${disabled ? 'opacity-50' : ''}
        ${className}
    `;

    const defaultTitleClasses = titleClassName
        ? titleClassName
        : `${getSizeClass(titleSize)} font-bold text-[#020F1E] truncate max-w-[70%]`;

    const defaultSubtitleClasses = subtitleClassName
        ? subtitleClassName
        : `${getSizeClass(subtitleSize)} font-medium text-[#666666] truncate mt-0.5 max-w-[70%]`;

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

    // ✅ Manejar selección del menú
    const handleMenuSelect = (optionId: string, optionLabel: string) => {
        setInternalSelectedId(optionId);
        setIsMenuOpen(false);
        onMenuSelect(optionId, optionLabel);
    };

    // ✅ Obtener label seleccionado
    const getSelectedLabel = () => {
        if (!internalSelectedId) return menuTriggerText;
        const selected = menuOptions.find(opt => opt.id === internalSelectedId);
        return selected?.label || menuTriggerText;
    };

    return (
        <div className={baseClasses}>
            {/* Leading + Title/Subtitle */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Leading (Icon/Imagen) */}
                {leading && (
                    <div className="flex-shrink-0">
                        {leading}
                    </div>
                )}

                {/* Title + Subtitle */}
                <div className="flex-1 min-w-0">
                    <div className={defaultTitleClasses}>
                        {title}
                    </div>
                    {subtitle && (
                        <div className={defaultSubtitleClasses}>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>

            {/* Trailing */}
            <div className="flex-shrink-0 ml-3 flex items-center gap-3">
                {/* ✅ Menú simplificado */}
                <div className="relative" ref={menuRef}>
                    {/* Botón trigger del menú - Simplificado */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                        disabled={disabled}
                        className="
                            flex items-center gap-2
                            text-gray-900 font-medium
                            transition-colors duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:text-gray-600
                        "
                    >
                        <span className="text-sm truncate max-w-[100px]">
                            {getSelectedLabel()}
                        </span>
                        <BiChevronRight className="w-5 h-5 flex-shrink-0" />
                    </button>

                    {/* ✅ Menú desplegable */}
                    {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[200px] overflow-hidden">
                            {menuOptions.map((option, index) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleMenuSelect(option.id, option.label)}
                                    className={`
                                        w-full px-4 py-3 text-left text-sm font-medium
                                        transition-colors duration-150
                                        flex items-center gap-3
                                        text-gray-900
                                        hover:bg-gray-50
                                        ${index !== menuOptions.length - 1 ? 'border-b border-gray-100' : ''}
                                        ${internalSelectedId === option.id
                                            ? 'bg-gray-50'
                                            : ''
                                        }
                                    `}
                                >
                                    <span className="flex-shrink-0 text-lg">
                                        {option.icon}
                                    </span>
                                    <span className="flex-1 truncate">
                                        {option.label}
                                    </span>
                                    {internalSelectedId === option.id && (
                                        <span className="text-gray-900 font-bold flex-shrink-0">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trailing original (si existe) */}
                {trailing && (
                    <div className="flex-shrink-0">
                        {trailing}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TileAppMenu;