import React from 'react';
import ButtonApp from '../../../../shared/components/ButtonApp';
import InputApp from '../../../../shared/components/InputApp';
import DescriptionApp from '../../../../shared/components/DescriptionApp';
import { useLogin } from '../hooks/useLogin';
import blueUser from '/illustrations/blueuser.png';
import AppHeader from '../../../../shared/components/AppHeader';

const LoginPage: React.FC = () => {
    const {
        email,
        isLoading,
        error,
        handleEmailChange,
        handleLogin,
    } = useLogin();

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader
                title="Iniciar sesión"
                showBackButton={false}
            />

            <div className='flex flex-col flex-1 justify-center'>
                {/* Imagen placeholder */}
                <div className="w-30 h-30 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center mt-4">
                    <img src={blueUser} alt="User Icon" className="w-full h-full" />
                </div>

                <DescriptionApp
                    title='Inicia sesión'
                    description='Inicia sesión con tu correo electrónico enlazado a tu cuenta CB para continuar'
                />

                {/* Input de correo */}
                <div className="mb-6">
                    <InputApp
                        label='Correo electronico'
                        type='email'
                        placeholder='ejemplo@correo.com'
                        value={email}
                        onChange={(e) => handleEmailChange(e.target.value)}
                        error={error}
                    />
                </div>

                {/* Botón continuar */}
                <div className="mb-6">
                    <ButtonApp
                        text="Continuar"
                        paddingVertical="py-2"
                        textSize='text-sm'
                        isMobile={true}
                        onClick={handleLogin}
                        loading={isLoading}
                        loadingText='Verificando...'
                        disabled={isLoading || !!error || !email}
                    />
                </div>
            </div>


        </div>
    );
};

export default LoginPage;