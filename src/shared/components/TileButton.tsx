import React, { type ReactNode } from "react";
import { IoChevronForward } from "react-icons/io5";

interface TileButtonProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  disabled?: boolean;
  showChevron?: boolean;
}

const TileButton: React.FC<TileButtonProps> = ({
  icon,
  title,
  subtitle,
  onClick,
  disabled = false,
  showChevron = true,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between gap-4
        px-6 py-5
        bg-white
        rounded-2xl
        shadow-md
        transition-all duration-200 ease-in-out
        border-0 outline-none
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg active:shadow-sm hover:scale-[1.02] active:scale-95 focus:ring-4 focus:ring-blue-100 cursor-pointer"
        }
      `}
    >
      {/* Leading - Icon con círculo azul */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
          {icon}
        </div>

        {/* Title + Subtitle */}
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-sm font-bold text-gray-900 truncate">{title}</h3>
          <p className="text-xs font-medium text-gray-500 truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Trailing - Chevron */}
      {showChevron && (
        <div className="flex-shrink-0 text-gray-400">
          <IoChevronForward className="w-5 h-5" />
        </div>
      )}
    </button>
  );
};

export default TileButton;
