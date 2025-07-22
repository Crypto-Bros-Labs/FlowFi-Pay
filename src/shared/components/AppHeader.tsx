import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { IoChevronBack } from 'react-icons/io5';

interface HeaderAction {
    icon: IconType;
    onClick: () => void;
    className?: string;
}

interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    leftAction?: HeaderAction;
    rightActions?: HeaderAction[];
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBackButton = true,
    onBack,
    leftAction,
    rightActions = []
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    // Si hay leftAction, no mostrar el botón de back
    const shouldShowBackButton = showBackButton && !leftAction;

    return (
        <div className="flex items-center justify-between p-4">
            {/* Lado izquierdo */}
            <div className="flex items-center">
                {shouldShowBackButton && (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoChevronBack className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                {leftAction && (
                    <button
                        onClick={leftAction.onClick}
                        className={`p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors ${leftAction.className || ''}`}
                    >
                        <leftAction.icon className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Título centrado */}
            {title && (
                <h1 className="text-lg font-semibold text-center flex-1 mx-4 text-gray-900">{title}</h1>
            )}

            {/* Lado derecho */}
            <div className="flex items-center gap-2">
                {rightActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${action.className || ''}`}
                    >
                        <action.icon className="w-6 h-6" />
                    </button>
                ))}
                {/* Spacer si no hay acciones a la derecha */}
                {rightActions.length === 0 && <div className="w-10"></div>}
            </div>
        </div>
    );
};

export default AppHeader;