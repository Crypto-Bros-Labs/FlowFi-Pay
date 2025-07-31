import { useNavigate } from "react-router-dom"
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";

export const useMain = () => {
    const navigate = useNavigate();
    const {
        isAccountOptionsLoading
    } = useAccountOptions();

    const goToSelectToken = () => {
        navigate("/select-token");
    };



    return {
        goToSelectToken,
        isAccountOptionsLoading
    };
}