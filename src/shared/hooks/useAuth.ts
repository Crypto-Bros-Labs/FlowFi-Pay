import { useState, useEffect, useCallback } from 'react';
import authLocalService from '../../features/login/data/local/authLocalService';
import userLocalService from '../../features/login/data/local/userLocalService';
import { useLocation } from 'react-router-dom';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isSignup, setIsSignup] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const location = useLocation();

    // Estabilizar la función con useCallback
    const checkAuthStatus = useCallback(() => {
        try {
            const hasAllData = userLocalService.getUserData().hasAllData;
            console.log('Checking auth status:', { hasAllData });
            setIsSignup(!!hasAllData);
            const hasTokens = authLocalService.hasTokens();
            setIsAuthenticated(hasTokens);
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []); // Sin dependencias para evitar recreaciones

    // Al cargar la app
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // En cada cambio de ruta
    useEffect(() => {
        checkAuthStatus();
    }, [location.pathname, checkAuthStatus]);

    return {
        isAuthenticated,
        isLoading,
        isSignup,
        checkAuthStatus
    };
};