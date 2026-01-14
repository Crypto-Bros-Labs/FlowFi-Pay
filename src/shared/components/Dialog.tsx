import React from "react";
import ButtonApp from "./ButtonApp";

interface DialogProps {
  open: boolean;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  nextText?: string;
  backText?: string;
  onClose?: () => void;
  hideBack?: boolean;
  hideNext?: boolean;
  children?: React.ReactNode;
  buttonsOrientation?: "horizontal" | "vertical";
}

const Dialog: React.FC<DialogProps> = ({
  open,
  title,
  subtitle,
  icon,
  onNext,
  onBack,
  nextText = "Continuar",
  backText = "Atrás",
  onClose,
  hideBack = false,
  hideNext = false,
  children,
  buttonsOrientation = "horizontal",
}) => {
  if (!open) return null;

  // ✅ Determinar si mostrar un botón o dos
  const showOnlyOneButton = hideBack || hideNext;
  const buttonText = hideBack ? nextText : backText;
  const buttonCallback = hideBack ? onNext : onBack;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 px-6 py-10 relative flex flex-col items-center">
        {/* Cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Icono */}
        {icon && <div className="mb-4">{icon}</div>}

        {/* Título */}
        <h2 className="text-xl font-bold text-[#020F1E] mb-2 text-center">
          {title}
        </h2>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-[#666666] text-center mb-2">{subtitle}</p>
        )}

        {/* Contenido extra */}
        {children}

        {/* ✅ Botones - Un botón o dos según la config */}
              <div
          className={`mt-2 w-full ${
            showOnlyOneButton
              ? ""
              : buttonsOrientation === "vertical"
              ? "flex flex-col gap-3"
              : "flex gap-3"
          }`}
        >
          {" "}
          {showOnlyOneButton ? (
            // ✅ Un solo botón extendido
            <ButtonApp
              text={buttonText || "Aceptar"}
              onClick={buttonCallback}
              isMobile={true}
              backgroundColor="bg-[#3E5EF5]"
              textColor="text-white"
            />
          ) : (
            // ✅ Dos botones normales
            <>
              {!hideBack && (
                <ButtonApp
                  text={backText}
                  onClick={onBack}
                  backgroundColor="bg-white"
                  textColor="text-blue-600"
                  isMobile={true}
                  stroke={true}
                />
              )}
              {!hideNext && (
                <ButtonApp
                  text={nextText}
                  onClick={onNext}
                  isMobile={true}
                  backgroundColor="bg-[#3E5EF5]"
                  textColor="text-white"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
