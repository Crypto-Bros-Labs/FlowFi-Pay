import React, { useState, useRef, useEffect, type ReactNode } from "react";

export interface ComboBoxOption {
  id: string | number;
  account?: string;
  component: ReactNode;
  disabled?: boolean;
}

interface ComboBoxAppProps {
  options: ComboBoxOption[];
  selectedId?: string | number;
  onSelect: (option: ComboBoxOption) => void;
  selectedComponent?: ReactNode;
  placeholder?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const ComboBoxApp: React.FC<ComboBoxAppProps> = ({
  options,
  selectedId,
  onSelect,
  selectedComponent,
  placeholder = <span className="text-gray-500">Seleccionar opción</span>,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const comboBoxRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.id === selectedId);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        comboBoxRef.current &&
        !comboBoxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: ComboBoxOption) => {
    if (!option.disabled) {
      onSelect(option);
      setIsOpen(false);
    }
  };

  const renderSelectedContent = () => {
    if (selectedComponent) {
      return selectedComponent;
    }
    if (selectedOption) {
      return selectedOption.component;
    }
    return placeholder;
  };

  return (
    <div ref={comboBoxRef} className={`relative w-full ${className}`}>
      {/* Botón principal */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
                    w-full p-2.5 flex items-center justify-between
                    border border-[#666666] rounded-[10px]
                    bg-white text-left
                    transition-all duration-200 ease-in-out
                    ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    }
                    ${isOpen ? "border-blue-500" : ""}
                `}
      >
        <div className="flex-1">{renderSelectedContent()}</div>

        {/* Chevron Down */}
        <svg
          className={`
                        w-5 h-5 text-gray-400 transition-transform duration-200 ease-in-out ml-2
                        ${isOpen ? "transform rotate-180" : ""}
                    `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown con animación */}
      <div
        className={`
                    absolute top-full left-0 right-0 z-50 mt-1
                    bg-white border border-[#666666] rounded-[10px]
                    shadow-lg overflow-hidden
                    transition-all duration-200 ease-in-out origin-top
                    ${
                      isOpen
                        ? "opacity-100 scale-y-100 translate-y-0"
                        : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
                    }
                `}
      >
        <div className="max-h-40 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
              className={`
                                w-full p-2.5 text-left flex items-center
                                transition-colors duration-150 ease-in-out
                                ${
                                  option.disabled
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-gray-50 cursor-pointer"
                                }
                                ${selectedId === option.id ? "bg-blue-50" : ""}
                            `}
            >
              <div className="flex-1">{option.component}</div>

              {/* Checkmark para opción seleccionada */}
              {selectedId === option.id && (
                <svg
                  className="w-5 h-5 text-blue-600 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Mensaje si no hay opciones */}
        {options.length === 0 && (
          <div className="p-2.5 text-gray-500 text-center">
            No hay opciones disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboBoxApp;
