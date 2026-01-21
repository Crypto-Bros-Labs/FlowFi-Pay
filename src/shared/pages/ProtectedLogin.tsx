import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/Layout";

interface ProtectedLoginProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedLogin: React.FC<ProtectedLoginProps> = ({
  children,
  requireAuth = true,
}) => {
  const { isAuthenticated, isSignup, isLoading } = useAuth();
  const location = useLocation();

  // Mientras carga autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E5EF5]"></div>
      </div>
    );
  }

  // ❌ NO REDIRIJAS si requireAuth es false (páginas públicas como /login, /otp)
  if (!requireAuth) {
    // Solo redirige si está autenticado Y completó signup
    if (isAuthenticated && isSignup) {
      console.log("Usuario autenticado, redirigiendo a /main");
      return <Navigate to="/main" replace />;
    }

    // Solo redirige si está autenticado pero NO completó signup
    if (isAuthenticated && !isSignup) {
      console.log(
        "Usuario autenticado pero sin signup, redirigiendo a /signup",
      );
      return <Navigate to="/signup" replace />;
    }

    // Si NO está autenticado, permite ver login/otp
    return <Layout>{children}</Layout>;
  }

  // requireAuth === true (páginas privadas)
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedLogin;
