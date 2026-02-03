import { useState, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userLocalService from "../../../login/data/local/userLocalService";
import userRepository from "../../../login/data/repositories/userRepository";
import { base64ToFile } from "../../../../shared/utils/dataUtils";
import type { DialogOptions } from "../../../../shared/contexts/DialogContext";
import { useAppData } from "../../../../shared/hooks/useAppData";

export const useProfile = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    userData,
    isLoadingUserData,
    setIsPerformingAction,
    profileImage,
    setProfileImage,
    fullName,
    setFullName,
  } = useAppData();

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");

  // Usar datos del contexto
  const role = userData?.role || "";
  const walletAddress = userData?.walletAddress || "";
  const formatedBalance = userData?.formatedBalance || 0.0;
  const balance = userData?.balance || 0.0;
  const kycStatus = userData?.kycStatus || "";
  const kycUrl = userData?.kycUrl || "";
  const verificationType = userData?.role === "BUSINESS" ? "KYB" : "KYC";

  const kycStatusInfo = useMemo(
    () => ({
      APPROVED: {
        label: `${verificationType} Verificado`,
        bgColor: "bg-green-100",
        bgTransparent: "bg-green-50/30",
        textColor: "text-green-800",
        description:
          "Tu identidad ha sido verificada exitosamente. Puedes realizar todas las operaciones sin restricciones.",
        icon: "✓",
      },
      REVIEW: {
        label: `${verificationType} en Proceso`,
        bgColor: "bg-yellow-100",
        bgTransparent: "bg-yellow-50/30",
        textColor: "text-yellow-800",
        description:
          "Tu solicitud de verificación está en revisión. Esto generalmente toma 24-48 horas.",
        icon: "⏳",
      },
      DECLINED: {
        label: `${verificationType} Rechazado`,
        bgColor: "bg-red-100",
        bgTransparent: "bg-red-50/30",
        textColor: "text-red-800",
        description:
          "Tu verificación ha sido rechazada. Por favor, revisa los documentos y vuelve a intentarlo. Si tienes dudas, contacta al soporte.",
        icon: "✗",
      },
      UNKNOWN: {
        label: `${verificationType} No Iniciado`,
        bgColor: "bg-gray-100",
        bgTransparent: "bg-gray-50/30",
        textColor: "text-gray-800",
        description: `No has iniciado tu proceso de verificación. Debes completar el ${verificationType} para realizar ciertas operaciones.`,
        icon: "?",
      },
      INVALID: {
        label: `${verificationType} No Disponible`,
        bgColor: "bg-gray-100",
        bgTransparent: "bg-gray-50/30",
        textColor: "text-gray-800",
        description: `El servicio de verificación ${verificationType} no está disponible en este momento. Por favor, intenta más tarde o contacta al soporte.`,
        icon: "!",
      },
    }),
    [verificationType],
  );

  const openKycUrl = useCallback(() => {
    if (!kycUrl || !kycUrl.trim()) {
      showDialog({
        title: "Error",
        subtitle: `No pudimos cargar la URL del ${verificationType}. Recarga la página e intenta de nuevo o intenta más tarde.`,
        nextText: "Entendido",
        hideBack: true,
      });
      return;
    }
    window.open(kycUrl, "_blank");
  }, [kycUrl, showDialog, verificationType]);

  // ✅ Handle único para mostrar información del KYC
  const handleKycStatusInfo = useCallback(() => {
    const info =
      kycStatusInfo[kycStatus as keyof typeof kycStatusInfo] ||
      kycStatusInfo.UNKNOWN;

    const dialogConfig: Record<string, DialogOptions> = {
      APPROVED: {
        title: `${verificationType} Verificado`,
        subtitle: info.description,
        nextText: "Aceptar",
        hideBack: true,
      },
      REVIEW: {
        title: `${verificationType} en Proceso`,
        subtitle: info.description,
        nextText: "Aceptar",
        hideBack: true,
      },
      DECLINED: {
        title: `${verificationType} Rechazado`,
        subtitle: info.description,
        nextText: "Reintentar",
        backText: "Cancelar",
        onNext: openKycUrl,
      },
      UNKNOWN: {
        title: `${verificationType} No Iniciado`,
        subtitle: info.description,
        nextText: `Iniciar ${verificationType}`,
        backText: "Más tarde",
        onNext: openKycUrl,
      },
      INVALID: {
        title: `${verificationType} No Disponible`,
        subtitle: info.description,
        nextText: "Entendido",
        hideBack: true,
      },
    };

    const config = dialogConfig[kycStatus] || dialogConfig.UNKNOWN;
    showDialog(config);
  }, [kycStatus, kycStatusInfo, openKycUrl, showDialog, verificationType]);

  const logOut = () => {
    showDialog({
      title: "Cerrar sesión",
      subtitle: "¿Estás seguro de que quieres cerrar sesión?",
      onNext: () => {
        userLocalService.clearUser();
        localStorage.removeItem("user-storage");
        localStorage.clear();
        console.log("Cerrando sesión...");
        navigate("/login");
      },
      nextText: "Continuar",
      backText: "Cancelar",
    });
  };

  const uploadImageToServer = async (imageBase64: string) => {
    try {
      setIsPerformingAction(true);
      setIsUploadingImage(true);
      const userCurrentData = await userRepository.getCurrentUserData();

      if (!userCurrentData) {
        throw new Error("No user data found");
      }

      const file = await base64ToFile(imageBase64, "profile-image.jpg");
      const formData = new FormData();
      formData.append("picture", file);

      const success = await userRepository.uploadUserPicture(
        formData,
        userCurrentData.userUuid || "",
      );

      if (success) {
        showDialog({
          title: "Imagen actualizada",
          subtitle: "Tu imagen de perfil ha sido actualizada correctamente",
          nextText: "Entendido",
        });
        // Refrescar datos después del POST
        return true;
      } else {
        throw new Error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showDialog({
        title: "Error al subir imagen",
        subtitle: "No pudimos subir tu imagen. La imagen debe ser menor a 2MB",
        nextText: "Entendido",
      });
      return false;
    } finally {
      setIsPerformingAction(false);
      setIsUploadingImage(false);
    }
  };

  // Función para manejar la selección de archivo
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        showDialog({
          title: "Archivo no válido",
          subtitle:
            "Por favor selecciona un archivo de imagen válido (JPG, PNG, etc.)",
          nextText: "Entendido",
        });
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showDialog({
          title: "Archivo muy grande",
          subtitle: "La imagen debe ser menor a 2MB",
          nextText: "Entendido",
        });
        return;
      }

      // Crear URL para preview Y subir al servidor
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);

        await uploadImageToServer(result);
      };
      reader.readAsDataURL(file);
    }

    // Limpiar el input
    if (event.target) {
      event.target.value = "";
    }
  };

  // Función para mostrar el modal de agregar imagen
  const handleAddProfileImage = () => {
    showDialog({
      title: "Agregar imagen de perfil",
      subtitle: "Selecciona una imagen para tu perfil",
      onNext: () => {
        fileInputRef.current?.click();
      },
      nextText: "Agregar",
      backText: "Cancelar",
    });
  };

  // Función para remover la imagen
  const handleRemoveProfileImage = () => {
    showDialog({
      title: "Eliminar imagen de perfil",
      subtitle: "¿Estás seguro de que quieres eliminar tu imagen de perfil?",
      onNext: async () => {
        const userUuid =
          (await userRepository.getCurrentUserData())?.userUuid || "";
        try {
          await userRepository.deleteUserPicture(userUuid);
          setProfileImage(null);
        } catch (error) {
          console.error("Error deleting profile picture:", error);
          showDialog({
            title: "Error al eliminar imagen",
            subtitle: "No pudimos eliminar tu imagen. Intenta de nuevo.",
            nextText: "Entendido",
          });
        }
      },
      nextText: "Eliminar",
      backText: "Cancelar",
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
      backText: "Cancelar",
    });
  };

  const validateFullName = (
    name: string,
  ): { isValid: boolean; error?: string } => {
    const trimmedName = name.trim();

    // Solo letras, espacios y acentos
    const nameRegex = /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/;

    if (!nameRegex.test(trimmedName)) {
      return {
        isValid: false,
        error: "El nombre solo puede contener letras y espacios",
      };
    }

    // Validar que tenga mínimo 2 palabras (nombre y apellido)
    const words = trimmedName.split(/\s+/).filter((word) => word.length > 0);
    if (words.length < 2) {
      return {
        isValid: false,
        error: "Debes ingresar al menos nombre y apellido",
      };
    }

    // Validar que cada palabra tenga mínimo 2 caracteres
    if (words.some((word) => word.length < 2)) {
      return {
        isValid: false,
        error: "Cada nombre debe tener mínimo 2 caracteres",
      };
    }

    return { isValid: true };
  };

  // Función para manejar el cambio en el input del nombre
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Permitir solo letras, espacios y acentos
    const filteredValue = value.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g, "");

    setTempName(filteredValue);
  };

  // Función para confirmar el cambio de nombre
  const handleConfirmNameChange = () => {
    const validation = validateFullName(tempName);

    if (!validation.isValid) {
      showDialog({
        title: "Nombre inválido",
        subtitle: validation.error || "El nombre no es válido",
        nextText: "Entendido",
      });
      return;
    }

    if (tempName.trim() === fullName) {
      handleCancelNameEdit();
      return;
    }

    showDialog({
      title: "Confirmar cambio",
      subtitle: `¿Estás seguro de que quieres cambiar tu nombre a "${tempName.trim()}"?`,
      onNext: () => {
        setFullName(tempName.trim());
        updateNameOnServer(tempName.trim());
        setIsEditingName(false);
        setTempName("");
      },
      onBack: () => {
        // Continuar editando
      },
      nextText: "Confirmar",
      backText: "Continuar editando",
    });
  };

  async function updateNameOnServer(newName: string) {
    try {
      const userData = await userRepository.getCurrentUserData();
      if (userData) {
        await userRepository.updateUser({
          userUuid: userData.userUuid || "",
          fullName: newName,
          image: profileImage || "",
          phone: userData.phone || "",
          type: "",
        });
      }
    } catch (error) {
      console.error("Error updating name on server:", error);
    }
  }

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

    // Funciones para el nombre
    fullName,
    isEditingName,
    tempName,
    role,
    handleEditName,
    handleNameChange,
    handleConfirmNameChange,
    handleCancelNameEdit,

    isLoadingUserData,
    isUploadingImage,

    uploadImageToServer,

    // Wallet
    walletAddress,
    formatedBalance,
    balance,

    // KYC CAPA
    kycStatus,
    handleKycStatusInfo,
    kycStatusInfo,
  };
};
