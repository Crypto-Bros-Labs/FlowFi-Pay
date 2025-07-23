import { useNavigate } from "react-router-dom"

export const useAppBar = () => {
    const navigate = useNavigate();

    const goToHistory = () => {
        navigate('/history')
    }

    const goToProfile = () => {
        navigate('/profile')
    }

    const goToCharge = () => {
        navigate('/set-amount')
    }

    return {
        goToHistory,
        goToProfile,
        goToCharge,
    }
}