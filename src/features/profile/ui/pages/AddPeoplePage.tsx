import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddPeople } from "../hooks/useAddPeople";
import team from "/illustrations/team.png";

const AddPeoplePage: React.FC = () => {
    const {
        email,
        setEmail,
        fullName,
        setFullName,
        emailError,
        fullNameError,
        isLoading,
        isFormValid,
        handleAddAccount,
    } = useAddPeople();

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader title="Agregar Miembros " />

            {/* Imagen placeholder */}
            <div className="w-50 h-30 mx-auto mb-6 mt-6 flex items-center justify-center">
                <img src={team} alt="User Icon" className="w-full h-full" />
            </div>

            <DescriptionApp
                title='Agrega a tu equipo'
                description='Agrega miembros a tu equipo para colaborar en la gestión de pagos solo con su correo y nombre.'
            />

            <div className="mb-6">
                <InputApp
                    label='Correo electrónico'
                    type='text'
                    placeholder='ejemplo@correo.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                />

            </div>

            <div className="mb-6">
                <InputApp
                    label='Nombre completo'
                    type='text'
                    placeholder='Prueba Usuario'
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={fullNameError}

                />
            </div>

            <div className="mt-auto mb-4">
                <ButtonApp
                    text="Agregar Miembro"
                    paddingVertical="py-2"
                    textSize='text-sm'
                    isMobile={true}
                    onClick={handleAddAccount}
                    loading={isLoading}
                    loadingText='Agregando...'
                    disabled={!isFormValid || isLoading}
                />
            </div>
        </div>
    );
}

export default AddPeoplePage;