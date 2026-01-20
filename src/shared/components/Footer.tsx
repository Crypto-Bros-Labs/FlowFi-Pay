import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020F1E] text-white py-12 px-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Información de la empresa */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-bold text-white mb-2">FlowFi Pay</h3>
            <p className="text-gray-300 text-center md:text-left">
              Made by CB Labs team. Supported by a Starknet
              Seed Grant.
            </p>
          </div>

          {/* Redes sociales */}
          <div className="flex flex-row gap-6 items-center">
            <a
              href="https://x.com/FlowFiPay"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#3E5EF5] transition-colors duration-200"
              aria-label="X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-8 h-8 hover:text-[#3E5EF5] transition-colors duration-200"
                viewBox="0 0 48 48"
              >
                <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 CB Labs. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
