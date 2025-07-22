import React from "react";
import ButtonApp from '../../../../shared/components/ButtonApp';
import DescriptionApp from '../../../../shared/components/DescriptionApp';
import OtpInput from '../components/OtpInput';
import { useOtp } from '../hooks/useOtp';
import secure from '/illustrations/secure.png';

const OtpPage: React.FC = () => {
    // Configuración del OTP
    const length = 4;
    const onComplete = (code: string) => {
        console.log('OTP completed:', code);
    };

    const {
        isLoading,
        handleLogin
    } = useOtp({ length, onComplete });

    return (
        <div className="flex flex-col h-full p-4">
            {/* Imagen placeholder */}
            <div className="w-30 h-30 mx-auto mb-6 flex items-center justify-center">
                <img src={secure} alt="Secure Icon" className="w-full h-full" />
            </div>

            <DescriptionApp
                title='Ingresa el codigo'
                description='Hemos enviado un código de verificación a tu correo'
            />

            {/* Input de OTP */}
            <div className="w-full mb-6">
                <OtpInput />
            </div>

            {/* Botón continuar */}
            <div className="mt-auto">
                <ButtonApp
                    text="Continuar"
                    paddingVertical="py-2"
                    textSize='text-sm'
                    isMobile={true}
                    onClick={handleLogin}
                    loading={isLoading}
                    loadingText='Verificando...'
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};

export default OtpPage;