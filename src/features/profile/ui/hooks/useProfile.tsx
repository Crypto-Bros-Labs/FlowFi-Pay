import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";
import userLocalService from "../../../login/data/local/userLocalService";


export const useProfile = () => {
    const navigate = useNavigate();
    const { showDialog } = useDialog();

    const logOut = () => {
        showDialog({
            title: "Cerrar sesión",
            subtitle: "¿Estás seguro de que quieres cerrar sesión?",
            onNext: () => {
                userLocalService.clearUser();
                localStorage.removeItem('user-storage');
                localStorage.clear();
                // Aquí puedes agregar la lógica para cerrar sesión, como limpiar el estado del usuario o eliminar tokens de autenticación.
                console.log("Cerrando sesión...");
                // Redirigir al usuario a la página de inicio de sesión o a otra página.
                navigate("/login");
            },
            nextText: "Continuar",
            backText: "Cancelar",
        })
    }

    return {
        logOut
    };
};
