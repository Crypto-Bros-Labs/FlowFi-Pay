import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import InputApp from "../../../../shared/components/InputApp";
import ComboBoxApp from "../../../../shared/components/ComboBoxApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import { useAddMember } from "../hooks/useAddMember";
import { BiUser } from "react-icons/bi";

const AddMemberPage: React.FC = () => {
    const {
        fullName,
        handleFullNameChange,
        email,
        handleEmailChange,
        roleOptionsCombo,
        selectedRoleComponent,
        handleRoleSelect,
        handleAddMember,
        isLoading,
        error,
        isFormValid,
    } = useAddMember();

    return (
        <div className="flex flex-col h-full p-4">
            {/* Header */}
            <AppHeader title="Agregar Miembro" showBackButton={true} />

            {/* Imagen placeholder */}
            <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center mt-4">
                <BiUser className="w-10 h-10 text-blue-600" />
            </div>

            {/* Descripción */}
            <DescriptionApp
                title="Agrega un nuevo miembro"
                description="Ingresa los datos del nuevo miembro de tu equipo"
            />

            {/* ✅ Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Nombre completo */}
            <div className="mb-6">
                <InputApp
                    label="Nombre completo"
                    type="text"
                    placeholder="Juan García López"
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Correo electrónico */}
            <div className="mb-6">
                <InputApp
                    label="Correo electrónico"
                    type="email"
                    placeholder="juan.garcia@example.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    error={error && email && !email.includes('@') ? 'Correo inválido' : undefined}
                    disabled={isLoading}
                />
            </div>

            {/* Rol */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-[#020F1E] mb-2">
                    Rol
                </label>
                <ComboBoxApp
                    options={roleOptionsCombo}
                    selectedComponent={selectedRoleComponent}
                    onSelect={handleRoleSelect}
                    placeholder={<span className="text-gray-500">Selecciona un rol</span>}
                    disabled={isLoading}
                />
            </div>

            {/* ✅ Información de roles */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Roles disponibles:</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                    <li><strong>Administrador:</strong> Acceso total a todas las funciones</li>
                    <li><strong>Vendedor:</strong> Puede vender y ver reportes</li>
                    <li><strong>Cajero:</strong> Solo puede procesar transacciones</li>
                </ul>
            </div>

            {/* Botón agregar */}
            <div className="mt-auto mb-4">
                <ButtonApp
                    text="Agregar miembro"
                    paddingVertical="py-3"
                    textSize="text-sm"
                    isMobile={true}
                    onClick={handleAddMember}
                    loading={isLoading}
                    loadingText="Agregando..."
                    disabled={!isFormValid || isLoading}
                />
            </div>
        </div>
    );
};

export default AddMemberPage;