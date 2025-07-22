import React, { type ReactNode } from 'react';

interface TileAppProps {
    title: string; // Obligatorio
    subtitle?: string;
    leading?: ReactNode; // Icon o imagen
    trailing?: ReactNode; // Componente React
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const TileApp: React.FC<TileAppProps> = ({
    title,
    subtitle,
    leading,
    trailing,
    onClick,
    disabled = false,
    className = ""
}) => {
    const isClickable = !!onClick && !disabled;

    const baseClasses = `
        w-full flex items-center justify-between
        transition-colors duration-150 ease-in-out
        ${isClickable
            ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
            : 'cursor-default'
        }
        ${disabled ? 'opacity-50' : ''}
        ${className}
    `;

    const content = (
        <>
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
                    <div className="text-sm font-bold text-[#020F1E] truncate">
                        {title}
                    </div>
                    {subtitle && (
                        <div className="text-xs font-medium text-[#666666] truncate mt-0.5">
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>

            {/* Trailing */}
            {trailing && (
                <div className="flex-shrink-0 ml-3">
                    {trailing}
                </div>
            )}
        </>
    );

    if (isClickable) {
        return (
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={baseClasses}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={baseClasses}>
            {content}
        </div>
    );
};

export default TileApp;