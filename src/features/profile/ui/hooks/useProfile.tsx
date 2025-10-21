import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userLocalService from "../../../login/data/local/userLocalService";

export const useProfile = () => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado para la imagen de perfil
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const logOut = () => {
        showDialog({
            title: "Cerrar sesión",
            subtitle: "¿Estás seguro de que quieres cerrar sesión?",
            onNext: () => {
                userLocalService.clearUser();
                localStorage.removeItem('user-storage');
                localStorage.clear();
                console.log("Cerrando sesión...");
                navigate("/login");
            },
            nextText: "Continuar",
            backText: "Cancelar",
        });
    };

    // Función para manejar la selección de archivo
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                showDialog({
                    title: "Archivo no válido",
                    subtitle: "Por favor selecciona un archivo de imagen válido (JPG, PNG, etc.)",
                    nextText: "Entendido"
                });
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showDialog({
                    title: "Archivo muy grande",
                    subtitle: "La imagen debe ser menor a 5MB",
                    nextText: "Entendido"
                });
                return;
            }

            // Crear URL para preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setProfileImage(result);
            };
            reader.readAsDataURL(file);
        }

        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        if (event.target) {
            event.target.value = '';
        }
    };

    // Función para mostrar el modal de agregar imagen
    const handleAddProfileImage = () => {
        showDialog({
            title: "Agregar imagen de perfil",
            subtitle: "Selecciona una imagen para tu perfil",
            onNext: () => {
                // Trigger del input file
                fileInputRef.current?.click();
            },
            nextText: "Agregar",
            backText: "Cancelar"
        });
    };

    // Función para remover la imagen
    const handleRemoveProfileImage = () => {
        showDialog({
            title: "Eliminar imagen de perfil",
            subtitle: "¿Estás seguro de que quieres eliminar tu imagen de perfil?",
            onNext: () => {
                setProfileImage(null);
            },
            nextText: "Eliminar",
            backText: "Cancelar"
        });
    };

    return {
        logOut,
        profileImage,
        fileInputRef,
        handleFileSelect,
        handleAddProfileImage,
        handleRemoveProfileImage
    };
};