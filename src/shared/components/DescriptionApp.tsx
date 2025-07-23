import React from "react";

interface DescriptionAppProps {
    title?: string;
    description?: string;
}

const DescriptionApp: React.FC<DescriptionAppProps> = ({ title = 'Hola', description }) => {
    return (
        <>
            {/* Título */}
            <h2 className="text-2xl font-bold text-[#020F1E] mb-3">
                {title}
            </h2>

            {/* Descripción */}
            <p className="text-[#666666] mb-4 md:mb-8 text-sm leading-relaxed">
                {description}
            </p>
        </>
    );
};

export default DescriptionApp;