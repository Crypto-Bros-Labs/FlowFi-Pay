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

    const goToTeam = () => {
        navigate('/team')
    }

    return {
        goToHistory,
        goToProfile,
        goToCharge,
        goToTeam,
    }
}