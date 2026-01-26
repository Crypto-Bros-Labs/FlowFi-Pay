import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppFAB() {
    const WHATSAPP_NUMBER = "14452785760";
    const DEFAULT_MESSAGE = "¡Hola! Me interesa conocer mas acerca de FlowFi Pay";
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

    return (
        <div className="fixed bottom-6 right-6 pointer-events-none">
            <span className="absolute inset-0 flex items-center justify-center">
                <span className="absolute w-14 h-14 rounded-full bg-[#3E5EF5] opacity-70 animate-ping [animation-duration:1.15s] [animation-delay:100ms]" />
                <span className="absolute w-12 h-12 rounded-full bg-[#3E5EF5] opacity-50 animate-ping [animation-duration:1.15s] [animation-delay:200ms]" />
                <span className="absolute w-10 h-10 rounded-full bg-[#3E5EF5] opacity-40 animate-ping [animation-duration:1.15s] [animation-delay:400ms]" />
            </span>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="relative pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full bg-[#3E5EF5] hover:bg-[#3E5EF5]/90 shadow-lg transition-transform duration-200 hover:scale-110"
            >
                <FaWhatsapp className="w-7 h-7 text-white" />
            </a>
        </div>
    );
};