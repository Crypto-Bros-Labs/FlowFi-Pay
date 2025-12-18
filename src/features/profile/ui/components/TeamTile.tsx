import React, { useState, useRef, useEffect, type ReactNode } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BsPerson } from "react-icons/bs";

export interface TeamMemberAction {
  id: string;
  label: string;
  icon: ReactNode;
  color?: string;
}

interface TeamTileProps {
  fullName: string;
  email: string;
  rol: string;
  isSignedIn?: boolean;
  actions: TeamMemberAction[];
  onActionClick: (actionId: string) => void;
  disabled?: boolean;
  className?: string;
}

const TeamTile: React.FC<TeamTileProps> = ({
  fullName,
  email,
  rol,
  isSignedIn = false,
  actions,
  onActionClick,
  disabled = false,
  className = "",
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const actionsIsEmpty = actions.length === 0;

  // ✅ Capitalizar primera letra
  const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // ✅ Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // ✅ Manejar acción del menú
  const handleActionClick = (actionId: string) => {
    setIsMenuOpen(false);
    onActionClick(actionId);
  };

  // ✅ Determinar el badge a mostrar
  const getBadgeContent = () => {
    if (!isSignedIn) {
      return {
        text: "Pendiente",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      };
    }
    return {
      text: capitalizeFirstLetter(rol),
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
    };
  };

  const badge = getBadgeContent();

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left side: Icon + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <BsPerson className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#020F1E] truncate">
              {fullName}
            </h3>
            <p className="text-xs font-medium text-[#666666] truncate mt-0.5">
              {email}
            </p>
          </div>
        </div>

        {/* Right side: Status/Rol + Menu */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status/Rol Badge */}
          <span
            className={`px-3 py-1 ${badge.bgColor} rounded-full text-xs font-medium ${badge.textColor}`}
          >
            {badge.text}
          </span>

          {/* Menu Dropdown - Solo mostrar si isSignedIn es true */}
          {isSignedIn && !actionsIsEmpty && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                disabled={disabled}
                className="
                                    p-1.5 rounded-lg hover:bg-gray-100
                                    transition-colors duration-200
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    flex items-center justify-center
                                "
                title="Más opciones"
              >
                <BiChevronDown
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[180px] overflow-hidden">
                  {actions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id)}
                      className={`
                                                w-full px-4 py-2.5 text-left text-sm font-medium
                                                transition-colors duration-150
                                                flex items-center gap-3
                                                hover:bg-gray-50
                                                ${
                                                  index !== actions.length - 1
                                                    ? "border-b border-gray-100"
                                                    : ""
                                                }
                                                ${
                                                  action.color
                                                    ? `text-${action.color}-600`
                                                    : "text-gray-900"
                                                }
                                            `}
                    >
                      <span className="flex-shrink-0 text-lg">
                        {action.icon}
                      </span>
                      <span className="flex-1 truncate">{action.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamTile;
