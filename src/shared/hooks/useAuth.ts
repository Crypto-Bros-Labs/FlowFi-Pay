import { useState, useEffect, useCallback } from "react";
import authLocalService from "../../features/login/data/local/authLocalService";
import userLocalService from "../../features/login/data/local/userLocalService";
import { useLocation } from "react-router-dom";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  const checkAuthStatus = useCallback(() => {
    try {
      const hasTokens = authLocalService.hasTokens();
      const userData = userLocalService.getUserData();
      const hasAllData = userData?.hasAllData || false;

      console.log("Auth check:", { hasTokens, hasAllData, userData });

      setIsSignup(!!hasAllData);
      setIsAuthenticated(hasTokens && hasAllData);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setIsSignup(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

  return {
    isAuthenticated,
    isLoading,
    isSignup,
    checkAuthStatus,
  };
};
