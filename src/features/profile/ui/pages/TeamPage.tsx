import React from "react";
import AppHeader from "../../../../shared/components/AppHeader";
import DescriptionApp from "../../../../shared/components/DescriptionApp";
import ButtonApp from "../../../../shared/components/ButtonApp";
import TeamTile from "../components/TeamTile";
import { useTeam } from "../hooks/useTeam";

const TeamPage: React.FC = () => {
  const {
    teamMembers,
    isLoading,
    error,
    addNewMember,
    memberActions,
    handleMemberAction,
  } = useTeam();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="h-9/10 md:h-12/12 lg:h-12/12 flex flex-col">
        {/* Header */}
        <AppHeader title="Equipo" showBackButton={true} />

        {/* Description */}
        <div className="mt-5">
          <DescriptionApp
            title="Administra tu equipo"
            description="Gestiona los miembros de tu equipo y sus permisos."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Team Members List - Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-gray-500 text-sm">
                No hay miembros en el equipo
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Agrega un nuevo miembro para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-3 px-0.5">
              {teamMembers.map((member) => (
                <TeamTile
                  key={member.id}
                  fullName={member.fullName}
                  email={member.email}
                  rol={member.rol}
                  isSignedIn={member.isSignedIn}
                  // ✅ No pasar actions si el rol es Administrador
                  actions={member.rol === "Administrador" ? [] : memberActions}
                  onActionClick={(actionId) =>
                    handleMemberAction(member.id, actionId)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Add Member Button - Fixed Bottom */}
        <div className="flex-shrink-0 ">
          <ButtonApp
            text="Agregar nuevo miembro"
            textSize="text-sm"
            paddingVertical="py-3"
            isMobile={true}
            onClick={addNewMember}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
