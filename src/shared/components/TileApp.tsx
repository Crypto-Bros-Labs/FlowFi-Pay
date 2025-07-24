import React, { type ReactNode } from 'react';

interface TileAppProps {
    title: string;
    subtitle?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    subtitleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    titleClassName?: string;
    subtitleClassName?: string;
}

const TileApp: React.FC<TileAppProps> = ({
    title,
    subtitle,
    leading,
    trailing,
    onClick,
    disabled = false,
    className = "",
    titleSize = "sm",
    subtitleSize = "xs",
    titleClassName = "",
    subtitleClassName = "",
}) => {
    const isClickable = !!onClick && !disabled;

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
        transition-colors duration-150 ease-in-out
        ${isClickable
            ? 'cursor-pointer hover:bg-gray-50 active:bg-gray-100'
            : 'cursor-default'
        }
        ${disabled ? 'opacity-50' : ''}
        ${className}
    `;

    // Clases por defecto solo si no se proporcionan clases personalizadas
    const defaultTitleClasses = titleClassName
        ? titleClassName
        : `${getSizeClass(titleSize)} font-bold text-[#020F1E] truncate max-w-[50%]`;

    const defaultSubtitleClasses = subtitleClassName
        ? subtitleClassName
        : `${getSizeClass(subtitleSize)} font-medium text-[#666666] truncate mt-0.5 max-w-[50%]`;

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