import { useNavigate } from "react-router-dom"

export const useMain = () => {
    const navigate = useNavigate();

    const goToSelectToken = () => {
        navigate("/select-token");
    };

    return {
        goToSelectToken
    };
}