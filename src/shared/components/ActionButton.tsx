import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`
        flex flex-col items-center justify-center
        w-28 py-5
        bg-white 
        rounded-2xl
        shadow-md 
        transition-all duration-200 ease-in-out
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg active:shadow-sm hover:scale-105 active:scale-95 focus:ring-4 focus:ring-blue-100"
        }
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700 text-center px-1">
        {label}
      </span>
    </button>
  );
};

export default ActionButton;
