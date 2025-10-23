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

    // Estado para el nombre del usuario
    const [fullName, setFullName] = useState<string>("Jorge Clavo");
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>("");

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

    // Función para iniciar la edición del nombre
    const handleEditName = () => {
        setTempName(fullName);
        setIsEditingName(true);

        showDialog({
            title: "Editar nombre",
            subtitle: "¿Quieres editar tu nombre?",
            onNext: () => {
                // El modal se cerrará y el estado isEditingName quedará en true
            },
            onBack: () => {
                setIsEditingName(false);
                setTempName("");
            },
            nextText: "Sí, editar",
            backText: "Cancelar"
        });
    };

    // Función para manejar el cambio en el input del nombre
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempName(event.target.value);
    };

    // Función para confirmar el cambio de nombre
    const handleConfirmNameChange = () => {
        if (tempName.trim() === "") {
            showDialog({
                title: "Nombre vacío",
                subtitle: "El nombre no puede estar vacío",
                nextText: "Entendido"
            });
            return;
        }

        if (tempName.trim() === fullName) {
            // Si no hay cambios, simplemente cancelar
            handleCancelNameEdit();
            return;
        }

        showDialog({
            title: "Confirmar cambio",
            subtitle: `¿Estás seguro de que quieres cambiar tu nombre a "${tempName.trim()}"?`,
            onNext: () => {
                setFullName(tempName.trim());
                setIsEditingName(false);
                setTempName("");
            },
            onBack: () => {
                // Continuar editando
            },
            nextText: "Confirmar",
            backText: "Continuar editando"
        });
    };

    // Función para cancelar la edición del nombre
    const handleCancelNameEdit = () => {
        setIsEditingName(false);
        setTempName("");
    };

    return {
        logOut,
        profileImage,
        fileInputRef,
        handleFileSelect,
        handleAddProfileImage,
        handleRemoveProfileImage,

        // Nuevas funciones para el nombre
        fullName,
        isEditingName,
        tempName,
        handleEditName,
        handleNameChange,
        handleConfirmNameChange,
        handleCancelNameEdit
    };
};