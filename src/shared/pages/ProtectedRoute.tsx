import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../../features/profile/ui/hooks/useProfile';
import Layout from '../components/Layout';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    allowedRoles,
}) => {
    const { isAuthenticated, isSignup, isLoading } = useAuth();
    const { role, isLoadingUserData } = useProfile();
    const location = useLocation();

    // ✅ Mientras se carga la autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E5EF5]"></div>
            </div>
        );
    }

    // ✅ Validar autenticación PRIMERO (sin cargar datos de perfil)
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!requireAuth && isAuthenticated && isSignup) {
        return <Navigate to="/main" replace />;
    }

    if (!requireAuth && isAuthenticated && !isSignup) {
        return <Navigate to="/signup" replace />;
    }

    // ✅ SOLO cargar datos de perfil si está autenticado
    if (isAuthenticated && isLoadingUserData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E5EF5]"></div>
            </div>
        );
    }

    // ✅ Validar roles SOLO si está autenticado y se cargaron los datos
    if (requireAuth && isAuthenticated && allowedRoles && role) {
        const userRole = role.toUpperCase();
        const allowedRolesUpper = allowedRoles.map(r => r.toUpperCase());

        if (!allowedRolesUpper.includes(userRole)) {
            console.warn(`Rol ${userRole} no permitido. Roles permitidos: ${allowedRolesUpper.join(', ')}`);
            return <Navigate to="/main" replace />;
        }
    }

    return (
        <>
            <Layout>
                {children}
            </Layout>
        </>
    );
};

export default ProtectedRoute;