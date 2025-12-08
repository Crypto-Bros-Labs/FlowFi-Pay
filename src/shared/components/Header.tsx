import React from 'react';
import ButtonApp from './ButtonApp';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleLearnMore = () => {
        navigate('/login');
    };

    const handleTryNow = () => {
        navigate('/main');
    };

    return (
        <header className="flex flex-row justify-between items-center px-4 md:px-8 h-16 md:h-20">
            <div>
                <Link to={'/'}>
                    <h1 className="text-lg md:text-3xl font-bold text-[#020F1E]">
                        FlowFi Pay
                    </h1>
                </Link>
            </div>

            <div className="flex flex-row justify-between items-center gap-2 md:gap-4">
                {/* Botón "Aprender más" - oculto en móvil */}
                <div className="hidden md:block">
                    <ButtonApp
                        text="Aprender más"
                        stroke={true}
                        textColor='text-[#020F1E]'
                        backgroundColor='bg-[#EAF2FC]'
                        textSize="text-sm md:text-base"
                        paddingVertical="py-2 md:py-3"
                        paddingHorizontal="px-4 md:px-6"
                        onClick={handleLearnMore}
                    />
                </div>

                {/* Botón "Empezar ahora" - visible en todas las pantallas */}
                <ButtonApp
                    text="Empezar ahora"
                    textSize="text-sm md:text-base"
                    paddingVertical="py-2 md:py-3"
                    paddingHorizontal="px-4 md:px-6"
                    onClick={handleTryNow}
                />
            </div>
        </header>
    );
};

export default Header;
