import React from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../../../shared/components/AppHeader";
import ButtonApp from "../../../../shared/components/ButtonApp";
import MemberTile from "../components/MemberTile";
import { useTeam } from "../hooks/useTeam";

const TeamPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        teamMembers,
        isLoadingTeam,
        isRemovingMember,
        handleInviteMember,
        handleRemoveMember,
    } = useTeam();

    if (isLoadingTeam) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando equipo...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4">
            <AppHeader
                title="Equipo"
                onBack={() => navigate('/profile')}
            />

            {/* Lista de miembros del equipo */}
            <div className="flex-1 overflow-y-auto mt-6">
                {teamMembers && teamMembers.length > 0 ? (
                    <div className="space-y-3">
                        {teamMembers.map((member) => (
                            <MemberTile
                                key={member.id}
                                id={member.id}
                                name={member.name}
                                email={member.email}
                                isAdmin={member.isAdmin}
                                onRemove={handleRemoveMember}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Sin miembros en el equipo
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Invita miembros para trabajar en equipo
                        </p>
                    </div>
                )}
            </div>

            {/* Botón invitar (fijo abajo) */}
            <div className="flex-shrink-0 mt-4 p-2">
                <ButtonApp
                    text="Invitar miembro"
                    paddingVertical="py-2"
                    textSize="text-base"
                    isMobile={true}
                    onClick={handleInviteMember}
                    disabled={isRemovingMember}
                />
            </div>
        </div>
    );
};

export default TeamPage;