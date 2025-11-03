import { useState, useCallback, useEffect } from 'react';
import { useDialog } from '../../../../shared/hooks/useDialog';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

export const useTeam = () => {
    const { showDialog } = useDialog();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [isLoadingTeam, setIsLoadingTeam] = useState(false);
    const [isRemovingMember, setIsRemovingMember] = useState(false);

    // ✅ Obtener miembros del equipo
    const fetchTeamMembers = useCallback(async () => {
        setIsLoadingTeam(true);
        try {

            const mockMembers: TeamMember[] = [
                {
                    id: 'member-1',
                    name: 'Juan Pérez',
                    email: 'juan@example.com',
                    isAdmin: true
                },
                {
                    id: 'member-2',
                    name: 'María García',
                    email: 'maria@example.com',
                    isAdmin: false
                },
                {
                    id: 'member-3',
                    name: 'Carlos López',
                    email: 'carlos@example.com',
                    isAdmin: false
                }
            ];

            setTeamMembers(mockMembers);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setIsLoadingTeam(false);
        }
    }, []);

    // ✅ Manejar invitación de nuevo miembro
    const handleInviteMember = useCallback(() => {
        showDialog({
            title: "Invitar miembro",
            subtitle: "¿A qué correo quieres enviar la invitación?",
            nextText: "Enviar invitación",
            backText: "Cancelar"
        });
    }, [showDialog]);

    // ✅ Manejar eliminación de miembro
    const handleRemoveMember = useCallback((memberId: string) => {
        const member = teamMembers.find(m => m.id === memberId);

        if (!member) return;

        showDialog({
            title: "Remover miembro",
            subtitle: `¿Estás seguro de que quieres remover a ${member.name} del equipo?`,
            onNext: async () => {
                setIsRemovingMember(true);
                try {
                    // ✅ Aquí iría la llamada a tu API para remover el miembro
                    // await teamRepository.removeMember(memberId);

                    setTeamMembers(prev => prev.filter(m => m.id !== memberId));

                    showDialog({
                        title: "Miembro removido",
                        subtitle: `${member.name} ha sido removido del equipo`,
                        nextText: "Entendido"
                    });
                } catch (error) {
                    console.error("Error removing member:", error);
                    showDialog({
                        title: "Error al remover",
                        subtitle: "No pudimos remover al miembro. Intenta de nuevo.",
                        nextText: "Entendido"
                    });
                } finally {
                    setIsRemovingMember(false);
                }
            },
            nextText: "Remover",
            backText: "Cancelar"
        });
    }, [teamMembers, showDialog]);

    // ✅ Cargar miembros al montar el componente
    useEffect(() => {
        fetchTeamMembers();
    }, [fetchTeamMembers]);

    return {
        teamMembers,
        isLoadingTeam,
        isRemovingMember,
        handleInviteMember,
        handleRemoveMember,
        refetchTeamMembers: fetchTeamMembers
    };
};