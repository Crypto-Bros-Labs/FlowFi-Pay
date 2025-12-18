import { useState, useCallback, useEffect, useMemo } from "react";
import { useDialog } from "../../../../shared/hooks/useDialog";
import { BiTrash, BiPencil } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import userRepository from "../../../login/data/repositories/userRepository";
import type { TeamMemberResponse } from "../../../login/data/models/userModel";

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  rol: string;
  isSignedIn?: boolean;
}

export interface TeamMemberAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
}

const translateRole = (role: string | undefined): string => {
  if (!role) return "empleado";

  const roleMap: Record<string, string> = {
    employee: "Empleado",
    EMPLOYEE: "Empleado",
    cashier: "Cajero",
    CASHIER: "Cajero",
    admin: "Administrador",
    ADMIN: "Administrador",
    user: "Administrador",
    USER: "Administrador",
    administrador: "Administrador",
    ADMINISTRADOR: "Administrador",
    empleado: "Empleado",
    EMPLEADO: "Empleado",
    cajero: "Cajero",
    CAJERO: "Cajero",
  };

  return roleMap[role] || "empleado";
};

export const useTeam = () => {
  const { showDialog } = useDialog();
  const navigate = useNavigate();

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Obtener datos del usuario actual (Admin/Owner)
      const userData = await userRepository.getCurrentUserData();
      const userUuid = userData?.userUuid;

      if (!userUuid) {
        throw new Error("No se pudo obtener el UUID del usuario");
      }

      // ✅ Crear miembro estático del admin/owner
      const adminMember: TeamMember = {
        id: userUuid,
        fullName: userData?.fullName || "Administrador",
        email: userData?.email || "",
        rol: "Administrador",
        isSignedIn: true,
      };

      // ✅ Obtener miembros del equipo
      const response = await userRepository.getTeamMembers(userUuid);

      // ✅ VALIDAR que response sea un array
      if (!Array.isArray(response)) {
        console.warn("Response no es un array:", response);
        setTeamMembers([adminMember]);
        return;
      }

      // ✅ Mapear el response a TeamMember
      const mappedMembers: TeamMember[] = response.map(
        (member: TeamMemberResponse) => ({
          id: member.memberUserUuid || "",
          fullName: member.fullName || "",
          email: member.email || "",
          rol: translateRole(member.role),
          isSignedIn: member.isSignedIn || false,
        })
      );

      // ✅ Agregar el admin al inicio de la lista
      const finalMembers = [adminMember, ...mappedMembers];

      setTeamMembers(finalMembers);
      console.log("✅ Team members loaded:", finalMembers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar equipo";
      setError(errorMessage);
      console.error("❌ Error fetching team members:", err);
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Eliminar miembro del equipo
  const removeMember = useCallback(async (memberId: string) => {
    try {
      // TODO: Llamar a API para eliminar
      // await teamRepository.removeMember(memberId);

      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId));
      console.log("Miembro eliminado:", memberId);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar miembro";
      setError(errorMessage);
      console.error("Error removing member:", err);
    }
  }, []);

  // ✅ Agregar nuevo miembro
  const addNewMember = useCallback(() => {
    console.log("Navegar a agregar nuevo miembro");
    navigate("/add-member");
  }, [navigate]);

  // ✅ Editar miembro
  const editMember = useCallback((memberId: string) => {
    console.log("Editar miembro:", memberId);
    // navigate(`/team/edit/${memberId}`);
  }, []);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // ✅ Definir acciones disponibles para cada miembro
  const memberActions = useMemo(
    () => [
      {
        id: "edit",
        label: "Editar",
        icon: <BiPencil className="w-4 h-4" />,
      },
      {
        id: "remove",
        label: "Eliminar",
        icon: <BiTrash className="w-4 h-4" />,
        color: "red",
      },
    ],
    []
  );

  // ✅ Manejar acciones del menú
  const handleMemberAction = (memberId: string, actionId: string) => {
    const member = teamMembers.find((m) => m.id === memberId);

    switch (actionId) {
      case "edit":
        editMember(memberId);
        break;

      case "remove":
        showDialog({
          title: "Eliminar miembro",
          subtitle: `¿Estás seguro de que deseas eliminar a ${member?.fullName} del equipo?`,
          onNext: () => {
            removeMember(memberId);
          },
          nextText: "Eliminar",
          backText: "Cancelar",
        });
        break;

      default:
        console.log("Acción desconocida:", actionId);
    }
  };

  return {
    teamMembers,
    isLoading,
    error,
    removeMember,
    addNewMember,
    editMember,
    fetchTeamMembers,
    memberActions,
    handleMemberAction,
  };
};
