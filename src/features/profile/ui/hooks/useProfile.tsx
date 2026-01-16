import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userLocalService from "../../../login/data/local/userLocalService";
import userRepository from "../../../login/data/repositories/userRepository";
import { base64ToFile } from "../../../../shared/utils/dataUtils";
import type { DialogOptions } from "../../../../shared/contexts/DialogContext";

export const useProfile = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para la imagen de perfil
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  // Estado para el nombre del usuario
  const [fullName, setFullName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>("");
  const [role, setRole] = useState<string>("");

  // Estado wallet
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [formatedBalance, setFormatedBalance] = useState<number>(0.0);
  const [balance, setBalance] = useState<number>(0.0);

  // Estado kyc CAPA
  const [kycStatus, setKycStatus] = useState<string>("");
  const [kycUrl, setKycUrl] = useState<string>("");

  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  const kycStatusInfo = useMemo(
    () => ({
      APPROVED: {
        label: "KYC Verificado",
        bgColor: "bg-green-100",
        bgTransparent: "bg-green-50/30",
        textColor: "text-green-800",
        description:
          "Tu identidad ha sido verificada exitosamente. Puedes realizar todas las operaciones sin restricciones.",
        icon: "✓",
      },
      REVIEW: {
        label: "KYC en Proceso",
        bgColor: "bg-yellow-100",
        bgTransparent: "bg-yellow-50/30",
        textColor: "text-yellow-800",
        description:
          "Tu solicitud de verificación está en revisión. Esto generalmente toma 24-48 horas.",
        icon: "⏳",
      },
      DECLINED: {
        label: "KYC Rechazado",
        bgColor: "bg-red-100",
        bgTransparent: "bg-red-50/30",
        textColor: "text-red-800",
        description:
          "Tu verificación ha sido rechazada. Por favor, revisa los documentos y vuelve a intentarlo. Si tienes dudas, contacta al soporte.",
        icon: "✗",
      },
      UNKNOWN: {
        label: "KYC No Iniciado",
        bgColor: "bg-gray-100",
        bgTransparent: "bg-gray-50/30",
        textColor: "text-gray-800",
        description:
          "No has iniciado tu proceso de verificación. Debes completar el KYC para realizar ciertas operaciones.",
        icon: "?",
      },
      INVALID: {
        label: "KYC No Disponible",
        bgColor: "bg-gray-100",
        bgTransparent: "bg-gray-50/30",
        textColor: "text-gray-800",
        description:
          "El servicio de verificación KYC no está disponible en este momento. Por favor, intenta más tarde o contacta al soporte.",
        icon: "!",
      },
    }),
    []
  );

  const openKycUrl = useCallback(() => {
    if (!kycUrl || !kycUrl.trim()) {
      showDialog({
        title: "Error",
        subtitle:
          "No pudimos cargar la URL del KYC. Recarga la página e intenta de nuevo o intenta más tarde.",
        nextText: "Entendido",
        hideBack: true,
      });
      return;
    }
    window.open(kycUrl, "_blank");
  }, [kycUrl, showDialog]);

  // ✅ Handle único para mostrar información del KYC
  const handleKycStatusInfo = useCallback(() => {
    const info =
      kycStatusInfo[kycStatus as keyof typeof kycStatusInfo] ||
      kycStatusInfo.UNKNOWN;

    const dialogConfig: Record<string, DialogOptions> = {
      APPROVED: {
        title: "KYC Verificado",
        subtitle: info.description,
        nextText: "Aceptar",
        hideBack: true,
      },
      REVIEW: {
        title: "KYC en Proceso",
        subtitle: info.description,
        nextText: "Aceptar",
        hideBack: true,
      },
      DECLINED: {
        title: "KYC Rechazado",
        subtitle: info.description,
        nextText: "Reintentar",
        backText: "Cancelar",
        onNext: openKycUrl,
      },
      UNKNOWN: {
        title: "KYC No Iniciado",
        subtitle: info.description,
        nextText: "Iniciar KYC",
        backText: "Más tarde",
        onNext: openKycUrl,
      },
      INVALID: {
        title: "KYC No Disponible",
        subtitle: info.description,
        nextText: "Entendido",
        hideBack: true,
      },
    };

    const config = dialogConfig[kycStatus] || dialogConfig.UNKNOWN;
    showDialog(config);
  }, [kycStatus, kycStatusInfo, openKycUrl, showDialog]);

  async function fetchUserData() {
    try {
      const userUuid =
        (await userRepository.getCurrentUserData())?.userUuid || "default-uuid";
      const userData = await userRepository.fetchUserData(userUuid);

      if (userData.success) {
        setFullName(userData.data.fullName || "");
        setRole(userData.data.role || "");
        setProfileImage(userData.data.image || null);
        setWalletAddress(userData.data.normalizedPublicKey || "");
        setFormatedBalance(parseFloat(userData.data.formatBalance) || 0.0);
        setBalance(parseFloat(userData.data.balance) || 0.0);
      } else {
        setFullName("");
        setRole("");
        setProfileImage(null);
        setWalletAddress("");
        setFormatedBalance(0.0);
        setBalance(0.0);
        console.error("Error fetching user data");
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      setFullName("");
      setProfileImage(null);
    }
  }

  async function fetchKycStatus() {
    try {
      const userUuid =
        (await userRepository.getCurrentUserData())?.userUuid || "default-uuid";
      const kycData = await userRepository.getKycStatus(userUuid);

      setKycStatus(kycData.status || "");
      setKycUrl(kycData.kycUrl || "");
    } catch (error) {
      console.error("Error fetching KYC status:", error);
      setKycStatus("unknown");
      setKycUrl("");
    }
  }

  useEffect(() => {
    let active = true;

    (async () => {
      setIsLoadingUserData(true);
      try {
        await fetchUserData(); // se espera esta
        if (!active) return;
        if (role === "CASHIER") return; // no fetch KYC para cajeros
        await fetchKycStatus(); // luego esta
      } finally {
        if (active) setIsLoadingUserData(false);
      }
    })();

    return () => {
      active = false; // evita updates si el componente desmonta
    };
  }, []);

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

  async function uploadImageToServer(imageBase64: string) {
    try {
      setIsUploadingImage(true);
      const userData = await userRepository.getCurrentUserData();

      if (!userData) {
        throw new Error("No user data found");
      }

      const file = await base64ToFile(imageBase64, "profile-image.jpg");

      const formData = new FormData();
      formData.append("picture", file);

      const success = await userRepository.uploadUserPicture(
        formData,
        userData.userUuid || ""
      );

      if (success) {
        showDialog({
          title: "Imagen actualizada",
          subtitle: "Tu imagen de perfil ha sido actualizada correctamente",
          nextText: "Entendido",
        });
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
      setIsUploadingImage(false);
    }
  }

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

    refetchUserData: fetchUserData,
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
