import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDialog } from '../../../../shared/hooks/useDialog';
import { BiTrash, BiPencil, BiCheckCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

export interface TeamMember {
    id: string;
    fullName: string;
    email: string;
    rol: string;
}

export interface TeamMemberAction {
    id: string;
    label: string;
    icon: React.ReactNode;
    color?: string;
}

export const useTeam = () => {
    const { showDialog } = useDialog();
    const navigate = useNavigate();

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            fullName: 'Juan García',
            email: 'juan.garcia@example.com',
            rol: 'administrador'
        },
        {
            id: '2',
            fullName: 'María López',
            email: 'maria.lopez@example.com',
            rol: 'empleado'
        },
        {
            id: '3',
            fullName: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            rol: 'cajero'
        },
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ Obtener miembros del equipo
    const fetchTeamMembers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: Reemplazar con llamada a API real
            // const response = await teamRepository.getTeamMembers();
            // setTeamMembers(response);

            console.log('Fetching team members...');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar equipo';
            setError(errorMessage);
            console.error('Error fetching team members:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ✅ Eliminar miembro del equipo
    const removeMember = useCallback(async (memberId: string) => {
        try {
            // TODO: Llamar a API para eliminar
            // await teamRepository.removeMember(memberId);

            setTeamMembers(prev => prev.filter(member => member.id !== memberId));
            console.log('Miembro eliminado:', memberId);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar miembro';
            setError(errorMessage);
            console.error('Error removing member:', err);
        }
    }, []);

    // ✅ Cambiar rol del miembro
    const changeMemberRole = useCallback(async (memberId: string, newRole: string) => {
        try {
            // TODO: Llamar a API para cambiar rol
            // await teamRepository.updateMemberRole(memberId, newRole);

            setTeamMembers(prev =>
                prev.map(member =>
                    member.id === memberId ? { ...member, rol: newRole } : member
                )
            );
            console.log('Rol actualizado:', memberId, newRole);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar rol';
            setError(errorMessage);
            console.error('Error changing role:', err);
        }
    }, []);

    // ✅ Agregar nuevo miembro
    const addNewMember = useCallback(() => {
        console.log('Navegar a agregar nuevo miembro');
        navigate('/add-member');
    }, [navigate]);

    // ✅ Editar miembro
    const editMember = useCallback((memberId: string) => {
        console.log('Editar miembro:', memberId);
        // navigate(`/team/edit/${memberId}`);
    }, []);

    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    // ✅ Definir acciones disponibles para cada miembro
    const memberActions = useMemo(() => [
        {
            id: 'edit',
            label: 'Editar',
            icon: <BiPencil className="w-4 h-4" />,
        },
        {
            id: 'change-role',
            label: 'Cambiar rol',
            icon: <BiCheckCircle className="w-4 h-4" />,
        },
        {
            id: 'remove',
            label: 'Eliminar',
            icon: <BiTrash className="w-4 h-4" />,
            color: 'red',
        },
    ], []);

    // ✅ Manejar acciones del menú
    const handleMemberAction = (memberId: string, actionId: string) => {
        const member = teamMembers.find(m => m.id === memberId);

        switch (actionId) {
            case 'edit':
                editMember(memberId);
                break;

            case 'change-role':
                changeMemberRole(memberId, member?.rol === 'administrador' ? 'vendedor' : 'administrador');
                break;

            case 'remove':
                showDialog({
                    title: 'Eliminar miembro',
                    subtitle: `¿Estás seguro de que deseas eliminar a ${member?.fullName} del equipo?`,
                    onNext: () => {
                        removeMember(memberId);
                    },
                    nextText: 'Eliminar',
                    backText: 'Cancelar',
                });
                break;

            default:
                console.log('Acción desconocida:', actionId);
        }
    };

    return {
        teamMembers,
        isLoading,
        error,
        removeMember,
        changeMemberRole,
        addNewMember,
        editMember,
        fetchTeamMembers,
        memberActions,
        handleMemberAction,
    };
};